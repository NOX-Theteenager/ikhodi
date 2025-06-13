import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

// Helper function to get the portfolio.json file path
const getPortfolioFilePath = () => {
  return path.join(process.cwd(), "data", "portfolio.json");
};

// Define Upload Directory and public path prefix
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'portfolio');
const PUBLIC_PATH_PREFIX = '/uploads/portfolio/';

interface Project {
  id: string | number;
  image?: string; // Main image path
  images?: string[]; // Gallery image paths
  [key: string]: any;
}

// Helper function to delete a local file if it exists
async function deleteLocalFile(filePath: string | undefined) {
  if (filePath && filePath.startsWith(PUBLIC_PATH_PREFIX)) {
    const localPath = path.join(process.cwd(), 'public', filePath);
    try {
      await fs.unlink(localPath);
      console.log(`Deleted file: ${localPath}`);
    } catch (err: any) {
      // ENOENT means file doesn't exist, which is fine. Log other errors.
      if (err.code !== 'ENOENT') {
        console.error(`Error deleting file ${localPath}:`, err);
      }
    }
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'Project ID is required.' }, { status: 400 });
    }

    const filePath = getPortfolioFilePath();
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ message: 'Portfolio data not found.' }, { status: 404 });
      }
      console.error('Error reading portfolio data file (GET):', error);
      return NextResponse.json({ message: 'Error reading portfolio data.' }, { status: 500 });
    }

    let projects: Project[];
    try {
      projects = JSON.parse(fileContent);
      if (!Array.isArray(projects)) {
        console.error('Portfolio data is not an array (GET).');
        return NextResponse.json({ message: 'Invalid portfolio data format.' }, { status: 500 });
      }
    } catch (error) {
      console.error('Error parsing portfolio data JSON (GET):', error);
      return NextResponse.json({ message: 'Error parsing portfolio data.' }, { status: 500 });
    }

    const project = projects.find(p => p.id.toString() === id);

    if (project) {
      return NextResponse.json(project);
    } else {
      return NextResponse.json({ message: `Project with ID ${id} not found.` }, { status: 404 });
    }

  } catch (error: any) {
    console.error(`Unexpected error in GET /api/portfolio/[id]:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: projectId } = params;
    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required for update.' }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const formData = await request.formData();
    const filePath = getPortfolioFilePath();

    let projects: Project[];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      projects = JSON.parse(fileContent);
      if (!Array.isArray(projects)) {
        return NextResponse.json({ message: 'Invalid portfolio data format.' }, { status: 500 });
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ message: 'Portfolio data not found.' }, { status: 404 });
      }
      console.error('Error reading/parsing portfolio.json (PUT):', error);
      return NextResponse.json({ message: 'Error processing portfolio data.' }, { status: 500 });
    }

    const projectIndex = projects.findIndex(p => p.id.toString() === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ message: `Project with ID ${projectId} not found.` }, { status: 404 });
    }

    // Use a mutable copy for updates
    const projectToUpdate: Project = JSON.parse(JSON.stringify(projects[projectIndex]));

    // Process text fields
    for (const field of ['title', 'category', 'description', 'client', 'year', 'externalLink']) {
      if (formData.has(field)) {
        projectToUpdate[field] = formData.get(field) as string;
      }
    }
    if (formData.has('services')) {
      const servicesString = formData.get('services') as string;
      projectToUpdate.services = servicesString ? servicesString.split(",").map(s => s.trim()).filter(s => s) : [];
    }

    // Handle Main Image Update
    const newMainImageFile = formData.get('image') as File | null;
    if (newMainImageFile && newMainImageFile.size > 0 && typeof newMainImageFile.arrayBuffer === 'function') {
      await deleteLocalFile(projectToUpdate.image);

      const mainImageOriginalName = newMainImageFile.name;
      const mainImageUniqueFilename = `${Date.now()}-${mainImageOriginalName.replace(/\s+/g, '_')}`;
      const mainImageSavePath = path.join(UPLOAD_DIR, mainImageUniqueFilename);
      const mainImageBuffer = Buffer.from(await newMainImageFile.arrayBuffer());
      await fs.writeFile(mainImageSavePath, mainImageBuffer);
      projectToUpdate.image = `${PUBLIC_PATH_PREFIX}${mainImageUniqueFilename}`;
    }

    // Granular Gallery Image Updates
    // 1. Process Deletions
    const galleryImagesToDeleteRaw = formData.get('galleryImagesToDelete') as string | null;
    if (galleryImagesToDeleteRaw) {
      const galleryImagesToDeletePaths = galleryImagesToDeleteRaw.split(',').map(p => p.trim()).filter(p => p);
      if (galleryImagesToDeletePaths.length > 0 && projectToUpdate.images) {
        for (const pathToDelete of galleryImagesToDeletePaths) {
          await deleteLocalFile(pathToDelete);
        }
        projectToUpdate.images = projectToUpdate.images.filter(
          (imgPath: string) => !galleryImagesToDeletePaths.includes(imgPath)
        );
      }
    }

    // 2. Process New Uploads (Append)
    const newGalleryImageFiles = formData.getAll('images') as File[];
    const uploadedGalleryImagePaths: string[] = [];
    for (const galleryFile of newGalleryImageFiles) {
      if (galleryFile && galleryFile.size > 0 && typeof galleryFile.arrayBuffer === 'function') {
        const galleryOriginalName = galleryFile.name;
        const galleryUniqueFilename = `${Date.now()}-${galleryOriginalName.replace(/\s+/g, '_')}`;
        const gallerySavePath = path.join(UPLOAD_DIR, galleryUniqueFilename);
        const galleryBuffer = Buffer.from(await galleryFile.arrayBuffer());
        await fs.writeFile(gallerySavePath, galleryBuffer);
        uploadedGalleryImagePaths.push(`${PUBLIC_PATH_PREFIX}${galleryUniqueFilename}`);
      }
    }

    if (uploadedGalleryImagePaths.length > 0) {
      if (!projectToUpdate.images || !Array.isArray(projectToUpdate.images)) {
        projectToUpdate.images = []; // Initialize if it was null/undefined or not an array
      }
      projectToUpdate.images.push(...uploadedGalleryImagePaths);
    }

    projects[projectIndex] = { ...projectToUpdate, id: projectId }; // Ensure ID is not changed
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');

    return NextResponse.json(projects[projectIndex]);

  } catch (error: any) {
    console.error(`Unexpected error in PUT /api/portfolio/[id]:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred during update.', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: projectId } = params;
    if (!projectId) {
      return NextResponse.json({ message: 'Project ID is required for deletion.' }, { status: 400 });
    }

    const filePath = getPortfolioFilePath();
    let projects: Project[];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      projects = JSON.parse(fileContent);
      if (!Array.isArray(projects)) {
        return NextResponse.json({ message: 'Invalid portfolio data format.' }, { status: 500 });
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ message: 'Portfolio data not found.' }, { status: 404 });
      }
      console.error('Error reading/parsing portfolio.json (DELETE):', error);
      return NextResponse.json({ message: 'Error processing portfolio data.' }, { status: 500 });
    }

    const projectIndex = projects.findIndex(p => p.id.toString() === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ message: `Project with ID ${projectId} not found.` }, { status: 404 });
    }

    const projectToDelete = projects[projectIndex];

    // Delete associated images
    await deleteLocalFile(projectToDelete.image);
    if (projectToDelete.images && Array.isArray(projectToDelete.images)) {
      for (const imagePath of projectToDelete.images) {
        await deleteLocalFile(imagePath);
      }
    }

    // Remove project from array
    const updatedProjects = projects.filter(p => p.id.toString() !== projectId);

    // Write updated projects array back to file
    await fs.writeFile(filePath, JSON.stringify(updatedProjects, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Project deleted successfully.' });

  } catch (error: any) {
    console.error(`Unexpected error in DELETE /api/portfolio/[id]:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred during deletion.', error: error.message }, { status: 500 });
  }
}
