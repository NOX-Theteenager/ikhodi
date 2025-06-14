import { NextResponse, NextRequest } from 'next/server';
import fs, { writeFile, mkdir, unlink } from 'fs/promises';
import path, { join } from 'path';
import { getConnection } from '../../../../lib/db'; // Adjusted path for MySQL connection utility

// Define the structure of a Portfolio Project (consistent with other route)
interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  image?: string | null;
  images?: string[]; // Stored as JSON string in DB
  description?: string | null;
  client?: string | null;
  year?: string | null;
  services?: string[]; // Stored as JSON string in DB
  externalLink?: string | null;
}

// Helper function to parse JSON fields from DB result (consistent with other route)
function parseProjectFromDb(project: any): PortfolioProject {
  if (!project) return project; // Return null or undefined as is
  return {
    ...project,
    images: project.images ? (typeof project.images === 'string' ? JSON.parse(project.images) : project.images) : [],
    services: project.services ? (typeof project.services === 'string' ? JSON.parse(project.services) : project.services) : [],
  };
}

// Helper function to prepare project data for DB (handles JSON stringification)
function prepareProjectForDbUpdate(project: Partial<PortfolioProject>): any {
  const dbUpdate: any = { ...project };
  if (project.images) {
    dbUpdate.images = JSON.stringify(project.images);
  }
  if (project.services) {
    dbUpdate.services = JSON.stringify(project.services);
  }
  return dbUpdate;
}

// GET Handler: Fetch a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }

    connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM portfolio WHERE id = ?', [projectId]);

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const project = parseProjectFromDb((rows as any[])[0]);
    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error('Failed to retrieve project from DB:', error);
    return NextResponse.json({ message: 'Error retrieving project' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// DELETE Handler: Delete a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }

    connection = await getConnection();

    // First, fetch the project to get image paths for deletion
    const [projectRows] = await connection.execute('SELECT image, images FROM portfolio WHERE id = ?', [projectId]);
    if ((projectRows as any[]).length === 0) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    const projectToDelete = parseProjectFromDb((projectRows as any[])[0]);

    // Delete from DB
    const [result] = await connection.execute('DELETE FROM portfolio WHERE id = ?', [projectId]);
    if ((result as any).affectedRows === 0) {
      // Should not happen if fetched successfully, but as a safeguard
      return NextResponse.json({ message: 'Project not found or already deleted' }, { status: 404 });
    }

    // Delete associated image files
    const uploadDirRoot = join(process.cwd(), 'public');
    if (projectToDelete.image) {
      try {
        await unlink(join(uploadDirRoot, projectToDelete.image));
        console.log(`Deleted main image: ${projectToDelete.image}`);
      } catch (e: any) {
        if (e.code !== 'ENOENT') console.warn(`Failed to delete main image ${projectToDelete.image}:`, e.message);
      }
    }
    if (projectToDelete.images && projectToDelete.images.length > 0) {
      for (const oldImagePath of projectToDelete.images) {
        try {
          await unlink(join(uploadDirRoot, oldImagePath));
          console.log(`Deleted gallery image: ${oldImagePath}`);
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.warn(`Failed to delete gallery image ${oldImagePath}:`, e.message);
        }
      }
    }

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete project from DB:', error);
    return NextResponse.json({ message: 'Error deleting project' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// PUT Handler: Update a project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }

    const formData = await request.formData();
    connection = await getConnection();

    // Fetch existing project data to compare images
    const [existingProjectRows] = await connection.execute('SELECT * FROM portfolio WHERE id = ?', [projectId]);
    if ((existingProjectRows as any[]).length === 0) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    let projectToUpdate = parseProjectFromDb((existingProjectRows as any[])[0]);

    const updateData: Partial<PortfolioProject> = {};

    // Update text fields if present in formData
    if (formData.has('title')) updateData.title = formData.get('title') as string;
    if (formData.has('category')) updateData.category = formData.get('category') as string;
    if (formData.has('description')) updateData.description = formData.get('description') as string;
    if (formData.has('client')) updateData.client = formData.get('client') as string;
    if (formData.has('year')) updateData.year = formData.get('year') as string;
    if (formData.has('services')) {
      const servicesString = formData.get('services') as string;
      updateData.services = servicesString ? servicesString.split(',').map(s => s.trim()).filter(s => s) : [];
    }
    if (formData.has('externalLink')) updateData.externalLink = formData.get('externalLink') as string;

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'portfolio_images');
    const uploadDirRoot = join(process.cwd(), 'public');
    await mkdir(uploadDir, { recursive: true });

    // Handle main image update
    const mainImageFile = formData.get('image') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      if (projectToUpdate.image && projectToUpdate.image.startsWith('/uploads/')) {
        try {
          await unlink(join(uploadDirRoot, projectToUpdate.image));
          console.log(`Deleted old main image: ${projectToUpdate.image}`);
        } catch (e: any) {
          if (e.code !== 'ENOENT') console.warn(`Failed to delete old main image ${projectToUpdate.image}:`, e.message);
        }
      }
      const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
      const safeFilename = mainImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const mainImageFilename = `${Date.now()}-${safeFilename}`;
      await writeFile(join(uploadDir, mainImageFilename), mainImageBuffer);
      updateData.image = `/uploads/portfolio_images/${mainImageFilename}`;
    } else if (formData.has('image_url')) {
      const imageUrl = formData.get('image_url') as string;
      // If image_url is empty string, it means delete the main image
      if (imageUrl === '' && projectToUpdate.image && projectToUpdate.image.startsWith('/uploads/')){
         try {
            await unlink(join(uploadDirRoot, projectToUpdate.image));
            console.log(`Deleted main image due to empty image_url: ${projectToUpdate.image}`);
          } catch (e: any) {
            if (e.code !== 'ENOENT') console.warn(`Failed to delete main image ${projectToUpdate.image}:`, e.message);
          }
      }
      updateData.image = imageUrl; // Can be empty string to remove or a new URL
    }

    // Handle gallery images update
    const galleryImageFiles = formData.getAll('images') as File[];
    const hasNewGalleryUploads = galleryImageFiles.some(file => file && file.size > 0);
    let newGalleryPaths: string[] = [];

    if (hasNewGalleryUploads) {
      for (const file of galleryImageFiles) {
        if (file && file.size > 0) {
          const imageBuffer = Buffer.from(await file.arrayBuffer());
          const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const filename = `${Date.now()}-${safeFilename}`;
          await writeFile(join(uploadDir, filename), imageBuffer);
          newGalleryPaths.push(`/uploads/portfolio_images/${filename}`);
        }
      }
      // If new files are uploaded, these become the new gallery. Old ones should be cleared if not managed by URLs.
      updateData.images = newGalleryPaths;
    } else if (formData.has('images_urls')) {
      const galleryImageUrlsString = formData.get('images_urls') as string;
      updateData.images = galleryImageUrlsString ? galleryImageUrlsString.split(',').map(s => s.trim()).filter(s => s) : [];
    }
    // Note: This logic replaces the entire gallery if 'images' or 'images_urls' is provided.
    // To support appending or partial removal via PUT on this endpoint would require more complex input structure.
    // Current setup: if images or images_urls is in formdata, it overwrites the existing gallery.
    // If neither is provided, projectToUpdate.images (from DB) remains unchanged for the images field.

    // Merge existing data with updateData
    const finalUpdateData = prepareProjectForDbUpdate({ ...projectToUpdate, ...updateData });

    // Construct SET clause for SQL query dynamically
    const setClauses = Object.keys(finalUpdateData)
      .filter(key => key !== 'id') // Exclude 'id' from SET clause
      .map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(finalUpdateData).filter((_, index) => Object.keys(finalUpdateData)[index] !== 'id'), projectId];

    if (setClauses.length === 0) {
      return NextResponse.json(projectToUpdate, { status: 200 }); // No actual changes to update
    }

    const query = `UPDATE portfolio SET ${setClauses} WHERE id = ?`;
    await connection.execute(query, values);

    // Fetch the updated project to return
    const [updatedRows] = await connection.execute('SELECT * FROM portfolio WHERE id = ?', [projectId]);
    const updatedProject = parseProjectFromDb((updatedRows as any[])[0]);

    return NextResponse.json(updatedProject, { status: 200 });

  } catch (error: any) {
    console.error('Failed to update project in DB:', error);
    return NextResponse.json({ message: 'Error updating project: ' + error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
