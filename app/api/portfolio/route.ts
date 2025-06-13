import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Buffer } from "buffer"; // Ensure Buffer is imported

// Helper function to get the portfolio.json file path
const getPortfolioFilePath = () => {
  return path.join(process.cwd(), "data", "portfolio.json");
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'portfolio');
const PUBLIC_PATH_PREFIX = '/uploads/portfolio/';


export async function GET(request: Request) {
  try {
    const filePath = getPortfolioFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");
    const projects = JSON.parse(fileContent);
    return NextResponse.json(projects);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json(
        { error: "Portfolio data not found." },
        { status: 404 }
      );
    } else if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format in portfolio data." },
        { status: 500 }
      );
    } else {
      console.error("Error reading portfolio data (GET):", error);
      return NextResponse.json(
        { error: "An unexpected error occurred while fetching projects." },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();

    // Extract text fields
    const title = formData.get('title') as string | null;
    const category = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;
    const client = formData.get('client') as string | null;
    const year = formData.get('year') as string | null;
    const servicesString = formData.get('services') as string | null;
    const externalLink = formData.get('externalLink') as string | null;

    // Basic Validation for text fields
    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Missing required text fields (title, category, description)." },
        { status: 400 }
      );
    }

    const newProjectData: any = {
      id: Date.now().toString(), // Unique ID
      title,
      category,
      description,
      client: client || "",
      year: year || "",
      services: servicesString ? servicesString.split(",").map(s => s.trim()).filter(s => s) : [],
      externalLink: externalLink || "",
      image: "", // Placeholder for main image path
      images: [], // Placeholder for gallery image paths
    };

    // Handle Main Image Upload
    const mainImageFile = formData.get('image') as File | null;
    if (!mainImageFile || typeof mainImageFile.arrayBuffer !== 'function') {
        // If 'image' is a string (URL) and not a file, it means no new file was uploaded.
        // This case might need to be handled if you allow updating projects without changing the image,
        // or if you still want to allow direct URL input.
        // For this subtask, we'll assume 'image' from formData should be a file for new projects.
        // If it's a string, it could be an old URL if the form still submits it.
        // We will prioritize file upload. If no file, then an error or allow string URL.
        // For now, let's make main image file mandatory for new project.
         return NextResponse.json({ error: "Main image file is required." }, { status: 400 });
    }

    // Check if mainImageFile is actually a file with content
    if (mainImageFile && mainImageFile.size > 0) {
        const mainImageOriginalName = mainImageFile.name;
        const mainImageUniqueFilename = `${Date.now()}-${mainImageOriginalName.replace(/\s+/g, '_')}`;
        const mainImageSavePath = path.join(UPLOAD_DIR, mainImageUniqueFilename);
        const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
        await fs.writeFile(mainImageSavePath, mainImageBuffer);
        newProjectData.image = `${PUBLIC_PATH_PREFIX}${mainImageUniqueFilename}`;
    } else {
        // This else block might be redundant due to the check above, but good for clarity
        return NextResponse.json({ error: "Main image file is required and cannot be empty." }, { status: 400 });
    }


    // Handle Gallery Images Upload
    const galleryImageFiles = formData.getAll('images') as File[];
    const galleryImagePaths: string[] = [];

    for (const galleryFile of galleryImageFiles) {
      if (galleryFile && typeof galleryFile.arrayBuffer === 'function' && galleryFile.size > 0) {
        const galleryOriginalName = galleryFile.name;
        // Sanitize filename slightly (replace spaces)
        const galleryUniqueFilename = `${Date.now()}-${galleryOriginalName.replace(/\s+/g, '_')}`;
        const gallerySavePath = path.join(UPLOAD_DIR, galleryUniqueFilename);
        const galleryBuffer = Buffer.from(await galleryFile.arrayBuffer());
        await fs.writeFile(gallerySavePath, galleryBuffer);
        galleryImagePaths.push(`${PUBLIC_PATH_PREFIX}${galleryUniqueFilename}`);
      }
    }
    newProjectData.images = galleryImagePaths;


    // Read existing projects, add new one, and write back
    const filePath = getPortfolioFilePath();
    let projects = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      projects = JSON.parse(fileContent);
      if (!Array.isArray(projects)) {
        console.warn("Portfolio data file does not contain a valid JSON array. Initializing.");
        projects = [];
      }
    } catch (error: any) {
      if (error.code === "ENOENT") {
        console.log("Portfolio data file not found. A new file will be created.");
      } else {
        // For other errors (like malformed JSON), throw to be caught by outer try-catch
        throw new Error(`Error reading portfolio data file: ${error.message}`);
      }
    }

    projects.push(newProjectData);
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json(newProjectData, { status: 201 });

  } catch (error: any) {
    console.error("Error processing POST request for portfolio:", error);
    // Check for specific error types if needed, e.g., file system errors
    if (error.message.startsWith("Error reading portfolio data file")) {
         return NextResponse.json({ error: "Failed to read existing portfolio data. " + error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: `An unexpected error occurred while adding the project: ${error.message}` },
      { status: 500 }
    );
  }
}
