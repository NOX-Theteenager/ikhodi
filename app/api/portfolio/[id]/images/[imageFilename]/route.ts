import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getConnection } from '../../../../../../lib/db'; // Adjusted path for MySQL connection utility

// Minimal Project interface needed for this route
interface ProjectImages {
  id: number;
  images?: string; // JSON string of image paths
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageFilename: string } }
) {
  let connection;
  try {
    const projectId = parseInt(params.id, 10);
    const imageFilenameToDelete = decodeURIComponent(params.imageFilename);

    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }
    if (!imageFilenameToDelete) {
      return NextResponse.json({ message: 'Image filename is required' }, { status: 400 });
    }

    connection = await getConnection();

    // Begin transaction
    await connection.beginTransaction();

    // Fetch the current images for the project
    const [rows] = await connection.execute('SELECT id, images FROM portfolio WHERE id = ? FOR UPDATE', [projectId]);

    if ((rows as any[]).length === 0) {
      await connection.rollback();
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const project = (rows as any[])[0] as ProjectImages;
    let currentImages: string[] = [];
    if (project.images && typeof project.images === 'string') {
      try {
        if (project.images.trim().startsWith('[') || project.images.trim().startsWith('"')) {
          currentImages = JSON.parse(project.images);
          if (!Array.isArray(currentImages)) {
            console.warn(`Project ID ${projectId}: 'images' field in DB parsed but was not an array: ${project.images}`);
            currentImages = [];
          }
        } else if (project.images.trim() !== '') {
          console.warn(`Project ID ${projectId}: 'images' field in DB is a string but not a valid JSON array/string format: ${project.images}`);
          // If you expect single raw image paths and want to treat them as a gallery of one (potentially problematic for this delete logic)
          // currentImages = [project.images.trim()];
          // For now, if it's not a JSON array string, treat as empty or error, as deleting from it is ambiguous.
          currentImages = [];
        }
      } catch (e) {
        console.error(`Project ID ${projectId}: Failed to parse 'images' JSON string from DB: ${project.images}`, e);
        currentImages = [];
      }
    } else if (Array.isArray(project.images)) {
      // This case should ideally not be hit if data comes directly from a DB query where it's a string
      currentImages = project.images;
    }

    const imagePathToRemove = `/uploads/portfolio_images/${imageFilenameToDelete}`;

    if (!currentImages.includes(imagePathToRemove)) {
      await connection.rollback();
      return NextResponse.json({ message: 'Image not found in project gallery' }, { status: 404 });
    }

    // Filter out the image to be deleted
    const updatedImages = currentImages.filter(img => img !== imagePathToRemove);
    const updatedImagesJson = JSON.stringify(updatedImages);

    // Update the database
    await connection.execute('UPDATE portfolio SET images = ? WHERE id = ?', [updatedImagesJson, projectId]);

    // Attempt to delete the actual image file
    const fullImageFilePath = path.join(process.cwd(), 'public', 'uploads', 'portfolio_images', imageFilenameToDelete);
    try {
      await fs.unlink(fullImageFilePath);
      console.log(`Deleted gallery image file: ${fullImageFilePath}`);
    } catch (e: any) {
      if (e.code !== 'ENOENT') { // Don't error if file simply didn't exist, but warn
        console.warn(`Failed to delete gallery image file ${fullImageFilePath}, but DB record updated:`, e.message);
        // Depending on policy, you might choose to rollback if file deletion fails critically
        // For now, we proceed as the DB record is the primary concern for consistency here
      }
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ message: 'Gallery image deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to delete gallery image:', error);
    if (connection) await connection.rollback(); // Rollback on any other error
    return NextResponse.json({ message: 'Error deleting gallery image: ' + error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
