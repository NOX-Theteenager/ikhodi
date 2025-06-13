import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises'; // Ensured fs.mkdir is available
import path, { join } from 'path'; // Ensured join is available
import { writeFile } from 'fs/promises'; // Specifically for writeFile

const filePath = path.join(process.cwd(), 'data', 'portfolio.json');

async function readPortfolioData() {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    // Handle empty file case, return empty array
    if (jsonData.trim() === '') {
      return [];
    }
    return JSON.parse(jsonData);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error reading portfolio data:', error);
    throw error; // Re-throw to be caught by the handler
  }
}

export async function GET() {
  try {
    const data = await readPortfolioData();
    // Ensure data is an array, even if file was empty or non-existent initially
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Failed to read portfolio data for GET:', error);
    return NextResponse.json({ message: 'Error reading portfolio data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const projects = await readPortfolioData();
    const currentProjects = Array.isArray(projects) ? projects : [];

    const newProject: any = {}; // Using 'any' for flexibility with FormData

    // Extract text fields
    newProject.title = formData.get('title') as string;
    newProject.category = formData.get('category') as string;
    newProject.description = formData.get('description') as string;
    newProject.client = formData.get('client') as string;
    newProject.year = formData.get('year') as string;
    const servicesString = formData.get('services') as string;
    newProject.services = servicesString ? servicesString.split(',').map(s => s.trim()).filter(s => s) : [];
    newProject.externalLink = formData.get('externalLink') as string || '';

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'portfolio_images');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Failed to create upload directory:", mkdirError);
      // This might not be fatal if directory already exists or has correct permissions
    }

    // Handle main image
    const mainImageFile = formData.get('image') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
      // Sanitize filename and make it unique
      const safeFilename = mainImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const mainImageFilename = `${Date.now()}-${safeFilename}`;
      const mainImagePath = join(uploadDir, mainImageFilename);
      await writeFile(mainImagePath, mainImageBuffer);
      newProject.image = `/uploads/portfolio_images/${mainImageFilename}`;
    } else if (formData.has('image_url')) { // Check if image_url is provided as fallback
        newProject.image = formData.get('image_url') as string || '';
    } else {
        newProject.image = ''; // Explicitly set to empty if neither file nor URL
    }


    // Handle gallery images
    const galleryImageFiles = formData.getAll('images') as File[];
    newProject.images = []; // Initialize as empty array
    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (const file of galleryImageFiles) {
        if (file && file.size > 0) {
          const imageBuffer = Buffer.from(await file.arrayBuffer());
          const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const filename = `${Date.now()}-${safeFilename}`;
          const imagePath = join(uploadDir, filename);
          await writeFile(imagePath, imageBuffer);
          newProject.images.push(`/uploads/portfolio_images/${filename}`);
        }
      }
    }
    // Fallback for gallery image URLs if no files uploaded but URLs provided via 'images_urls'
    if (newProject.images.length === 0 && formData.has('images_urls')) {
        const galleryImageUrlsString = formData.get('images_urls') as string;
        if (galleryImageUrlsString) {
            newProject.images = galleryImageUrlsString.split(',').map(s => s.trim()).filter(s => s);
        }
    }

    // Assign ID
    let maxId = 0;
    if (currentProjects.length > 0) {
      maxId = Math.max(...currentProjects.map(p => (typeof p.id === 'number' ? p.id : 0)));
    }
    newProject.id = maxId + 1;

    currentProjects.push(newProject);
    await fs.writeFile(filePath, JSON.stringify(currentProjects, null, 2), 'utf-8');

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Failed to add new project with image uploads:', error);
    // Check if the error is due to invalid JSON in the request (though less likely with FormData)
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json({ message: 'Invalid format in request (expected FormData)' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error adding new project: ' + error.message }, { status: 500 });
  }
}
