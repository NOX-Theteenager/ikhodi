import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path, { join } from 'path';
import { writeFile, mkdir } from 'fs/promises'; // Specifically for writeFile and mkdir
import { getConnection } from '../../../lib/db'; // Import MySQL connection utility

// Define the structure of a Portfolio Project
interface PortfolioProject {
  id?: number; // Optional because it's auto-incremented on insert
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

// Helper function to ensure correct data types for database insertion
function prepareProjectForDb(project: any): PortfolioProject {
  return {
    title: project.title,
    category: project.category,
    image: project.image || null,
    images: project.images ? JSON.stringify(project.images) : null, // Convert array to JSON string
    description: project.description || null,
    client: project.client || null,
    year: project.year || null,
    services: project.services ? JSON.stringify(project.services) : null, // Convert array to JSON string
    externalLink: project.externalLink || null,
  };
}

// Helper function to parse JSON fields from DB result
function parseProjectFromDb(project: any): PortfolioProject {
  return {
    ...project,
    images: project.images ? JSON.parse(project.images) : [],
    services: project.services ? JSON.parse(project.services) : [],
  };
}

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM portfolio ORDER BY id DESC');
    const projects = (rows as any[]).map(parseProjectFromDb);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to read portfolio data from DB:', error);
    return NextResponse.json({ message: 'Error reading portfolio data' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function POST(request: NextRequest) {
  let connection;
  try {
    const formData = await request.formData();
    connection = await getConnection();

    const newProject: any = {};

    // Extract text fields
    newProject.title = formData.get('title') as string;
    newProject.category = formData.get('category') as string;
    newProject.description = formData.get('description') as string;
    newProject.client = formData.get('client') as string;
    newProject.year = formData.get('year') as string;
    const servicesString = formData.get('services') as string;
    newProject.services = servicesString ? servicesString.split(',').map(s => s.trim()).filter(s => s) : [];
    newProject.externalLink = formData.get('externalLink') as string || '';

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'portfolio_images');
    await mkdir(uploadDir, { recursive: true });

    // Handle main image
    const mainImageFile = formData.get('image') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
      const safeFilename = mainImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const mainImageFilename = `${Date.now()}-${safeFilename}`;
      const mainImagePath = join(uploadDir, mainImageFilename);
      await writeFile(mainImagePath, mainImageBuffer);
      newProject.image = `/uploads/portfolio_images/${mainImageFilename}`;
    } else if (formData.has('image_url')) {
        newProject.image = formData.get('image_url') as string || '';
    } else {
        newProject.image = null;
    }

    // Handle gallery images
    const galleryImageFiles = formData.getAll('images') as File[];
    newProject.images = [];
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
    if (newProject.images.length === 0 && formData.has('images_urls')) {
        const galleryImageUrlsString = formData.get('images_urls') as string;
        if (galleryImageUrlsString) {
            newProject.images = galleryImageUrlsString.split(',').map(s => s.trim()).filter(s => s);
        }
    }

    const projectForDb = prepareProjectForDb(newProject);

    const [result] = await connection.execute(
      'INSERT INTO portfolio (title, category, description, client, year, services, externalLink, image, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        projectForDb.title,
        projectForDb.category,
        projectForDb.description,
        projectForDb.client,
        projectForDb.year,
        projectForDb.services, // Already stringified JSON
        projectForDb.externalLink,
        projectForDb.image,
        projectForDb.images, // Already stringified JSON
      ]
    );

    const insertedId = (result as any).insertId;
    const createdProject = { ...newProject, id: insertedId };

    return NextResponse.json(parseProjectFromDb(createdProject), { status: 201 });
  } catch (error: any) {
    console.error('Failed to add new project to DB with image uploads:', error);
    return NextResponse.json({ message: 'Error adding new project: ' + error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
