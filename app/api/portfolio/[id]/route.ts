import { NextResponse, NextRequest } from 'next/server';
import fs, { writeFile, mkdir, unlink } from 'fs/promises'; // Added mkdir, unlink. fs for fs.writeFile later.
import path, { join } from 'path'; // Ensured join is available

const filePath = path.join(process.cwd(), 'data', 'portfolio.json');

interface Project {
  id: number;
  title: string;
  category: string;
  image?: string;
  images?: string[]; // Array of image URLs
  description?: string;
  client?: string;
  year?: string;
  services?: string[]; // Array of strings
  externalLink?: string;
}

async function readPortfolioData(): Promise<Project[]> {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    // Handle empty file case, return empty array
    if (jsonData.trim() === '') {
      return [];
    }
    const data = JSON.parse(jsonData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error reading portfolio data:', error);
    throw new Error('Failed to read portfolio data. Please check server logs.');
  }
}

// GET Handler (existing)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }
    const projects = await readPortfolioData();
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error('Failed to retrieve project:', error);
    if (error.message && error.message.includes('Failed to read portfolio data')) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Error retrieving project' }, { status: 500 });
  }
}

// DELETE Handler (existing)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }
    let projects = await readPortfolioData();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Bonus: Delete associated images before removing project from data
    const projectToDelete = projects[projectIndex];
    const uploadDirRoot = join(process.cwd(), 'public');

    if (projectToDelete.image) {
        try {
            await unlink(join(uploadDirRoot, projectToDelete.image));
            console.log(`Deleted main image: ${projectToDelete.image}`);
        } catch (e: any) {
            if (e.code !== 'ENOENT') { // Don't warn if file simply didn't exist
                 console.warn(`Failed to delete main image ${projectToDelete.image}:`, e.message);
            }
        }
    }
    if (projectToDelete.images && projectToDelete.images.length > 0) {
        for (const oldImagePath of projectToDelete.images) {
            try {
                await unlink(join(uploadDirRoot, oldImagePath));
                console.log(`Deleted gallery image: ${oldImagePath}`);
            } catch (e: any) {
                 if (e.code !== 'ENOENT') {
                    console.warn(`Failed to delete gallery image ${oldImagePath}:`, e.message);
                }
            }
        }
    }

    projects.splice(projectIndex, 1);
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    if (error.message && error.message.includes('Failed to read portfolio data')) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Error deleting project' }, { status: 500 });
  }
}

// PUT Handler for updating a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }

    const formData = await request.formData();
    let projects = await readPortfolioData();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    let projectToUpdate = { ...projects[projectIndex] }; // Copy existing project data

    // Update text fields - only if the field exists in formData
    if (formData.has('title')) projectToUpdate.title = formData.get('title') as string;
    if (formData.has('category')) projectToUpdate.category = formData.get('category') as string;
    if (formData.has('description')) projectToUpdate.description = formData.get('description') as string;
    if (formData.has('client')) projectToUpdate.client = formData.get('client') as string;
    if (formData.has('year')) projectToUpdate.year = formData.get('year') as string;
    if (formData.has('services')) {
      const servicesString = formData.get('services') as string;
      projectToUpdate.services = servicesString ? servicesString.split(',').map(s => s.trim()).filter(s => s) : [];
    }
    if (formData.has('externalLink')) projectToUpdate.externalLink = formData.get('externalLink') as string;


    const uploadDir = join(process.cwd(), 'public', 'uploads', 'portfolio_images');
    const uploadDirRoot = join(process.cwd(), 'public'); // For constructing paths for unlink
    await mkdir(uploadDir, { recursive: true });

    // Handle main image update
    const mainImageFile = formData.get('image') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      // Bonus: Delete old main image if it exists
      if (projectToUpdate.image && typeof projectToUpdate.image === 'string' && projectToUpdate.image.startsWith('/uploads/')) {
        try {
          await unlink(join(uploadDirRoot, projectToUpdate.image));
           console.log(`Deleted old main image: ${projectToUpdate.image}`);
        } catch (e: any) {
            if (e.code !== 'ENOENT') { // Don't warn if file simply didn't exist
                console.warn(`Failed to delete old main image ${projectToUpdate.image}:`, e.message);
            }
        }
      }
      const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
      const safeFilename = mainImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const mainImageFilename = `${Date.now()}-${safeFilename}`;
      await writeFile(join(uploadDir, mainImageFilename), mainImageBuffer);
      projectToUpdate.image = `/uploads/portfolio_images/${mainImageFilename}`;
    } else if (formData.has('image_url')) {
        // If image_url is explicitly provided (even if empty), update the image field.
        // This allows clearing the image by sending an empty image_url.
        projectToUpdate.image = formData.get('image_url') as string;
    }


    // Handle gallery images update
    const galleryImageFiles = formData.getAll('images') as File[];
    // Check if there are any actual files being uploaded for the gallery
    const hasNewGalleryUploads = galleryImageFiles.some(file => file && file.size > 0);

    if (hasNewGalleryUploads) {
      // Initialize images array if it's null or undefined
      if (!projectToUpdate.images) {
        projectToUpdate.images = [];
      }

      for (const file of galleryImageFiles) {
        if (file && file.size > 0) { // Ensure to process only valid files
          const imageBuffer = Buffer.from(await file.arrayBuffer());
          const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const filename = `${Date.now()}-${safeFilename}`;
          await writeFile(join(uploadDir, filename), imageBuffer);
          projectToUpdate.images.push(`/uploads/portfolio_images/${filename}`);
        }
      }
    } else if (formData.has('images_urls')) {
        // If images_urls is explicitly provided, update the images field.
        // This allows clearing or replacing the gallery with URLs.
        const galleryImageUrlsString = formData.get('images_urls') as string;
        projectToUpdate.images = galleryImageUrlsString ? galleryImageUrlsString.split(',').map(s => s.trim()).filter(s => s) : [];
    }
    // If no new gallery files ('images' field in FormData was empty or only contained empty files)
    // AND no 'images_urls' field was provided, the existing projectToUpdate.images is preserved.

    projects[projectIndex] = projectToUpdate;
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');

    return NextResponse.json(projectToUpdate, { status: 200 });

  } catch (error: any) {
    console.error('Failed to update project with image uploads:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json({ message: 'Invalid format in request (expected FormData)' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating project: ' + error.message }, { status: 500 });
  }
}
