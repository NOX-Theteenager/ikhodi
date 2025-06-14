import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'portfolio.json');

interface Project {
  id: number;
  title: string;
  category: string;
  image?: string;
  images?: string[];
  description?: string;
  client?: string;
  year?: string;
  services?: string[];
  externalLink?: string;
}

async function readPortfolioData(): Promise<Project[]> {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageFilename: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    const imageFilename = decodeURIComponent(params.imageFilename);

    if (isNaN(projectId)) {
      return NextResponse.json({ message: 'Invalid project ID format' }, { status: 400 });
    }
    if (!imageFilename) {
      return NextResponse.json({ message: 'Image filename is required' }, { status: 400 });
    }

    let projects = await readPortfolioData();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const projectToUpdate = projects[projectIndex];
    const imagePathToRemove = `/uploads/portfolio_images/${imageFilename}`;

    if (projectToUpdate.images && projectToUpdate.images.includes(imagePathToRemove)) {
      projectToUpdate.images = projectToUpdate.images.filter(img => img !== imagePathToRemove);

      // Attempt to delete the actual image file
      const fullImageFilePath = path.join(process.cwd(), 'public', 'uploads', 'portfolio_images', imageFilename);
      try {
        await fs.unlink(fullImageFilePath);
        console.log(`Deleted gallery image file: ${fullImageFilePath}`);
      } catch (e: any) {
        if (e.code !== 'ENOENT') { // Don't error if file simply didn't exist, but warn
          console.warn(`Failed to delete gallery image file ${fullImageFilePath}:`, e.message);
        }
      }

      projects[projectIndex] = projectToUpdate;
      await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');
      return NextResponse.json({ message: 'Gallery image deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Image not found in project gallery' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Failed to delete gallery image:', error);
    if (error.message && error.message.includes('Failed to read portfolio data')) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Error deleting gallery image' }, { status: 500 });
  }
}
