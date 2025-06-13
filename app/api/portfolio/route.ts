import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    const projects = await readPortfolioData();
    // Ensure projects is an array
    const currentProjects = Array.isArray(projects) ? projects : [];

    const newProject = await request.json();

    // Assign a new ID - simple increment based on current max ID
    let maxId = 0;
    if (currentProjects.length > 0) {
      // Ensure all existing projects have numeric IDs, default to 0 if not
      maxId = Math.max(...currentProjects.map(p => (typeof p.id === 'number' ? p.id : 0)));
    }
    newProject.id = maxId + 1;

    currentProjects.push(newProject);
    await fs.writeFile(filePath, JSON.stringify(currentProjects, null, 2), 'utf-8');

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Failed to add new project:', error);
    // Check if the error is due to invalid JSON in the request
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json({ message: 'Invalid JSON format in request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error adding new project' }, { status: 500 });
  }
}
