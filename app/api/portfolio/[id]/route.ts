import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'portfolio.json');

interface Project {
  id: number;
  // Add other project properties if needed for type consistency, though not strictly necessary for delete
  title: string;
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
      return []; // File not found, return empty array
    }
    console.error('Error reading portfolio data:', error);
    throw new Error('Failed to read portfolio data.');
  }
}

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

    projects.splice(projectIndex, 1); // Remove the project

    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    // Alternatively, use status 204 No Content if not returning a message body:
    // return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Failed to delete project:', error);
    if (error instanceof Error && error.message.includes('Failed to read portfolio data')) {
        return NextResponse.json({ message: 'Error accessing portfolio data' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Error deleting project' }, { status: 500 });
  }
}

// Later, a GET handler for a single project and a PUT handler for updates can be added here.
