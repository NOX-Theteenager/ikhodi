import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper function to get the file path
const getPortfolioFilePath = () => {
  return path.join(process.cwd(), "data", "portfolio.json");
};

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
    const newProjectData = await request.json();

    // Basic Validation
    const { title, category, description, image } = newProjectData;
    if (!title || !category || !description || !image) {
      return NextResponse.json(
        { error: "Missing required fields (title, category, description, image)." },
        { status: 400 }
      );
    }

    const filePath = getPortfolioFilePath();
    let projects = [];

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      projects = JSON.parse(fileContent);
      if (!Array.isArray(projects)) {
        // If the file content is not an array, initialize with an empty array or handle as error
        console.warn("Portfolio data file does not contain a valid JSON array. Initializing with new project.");
        projects = [];
      }
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // File doesn't exist, so we'll create it with the new project
        console.log("Portfolio data file not found. A new file will be created.");
      } else if (error instanceof SyntaxError) {
         // If JSON is malformed, it's a problem. For POST, we might decide to overwrite or return error.
         // For now, let's log and start fresh if it's badly malformed, or try to append if it's just empty/not an array.
        console.error("Error parsing portfolio data file (POST):", error);
        return NextResponse.json(
            { error: "Error reading existing portfolio data. Check server logs." },
            { status: 500 }
        );
      } else {
        // Other read errors
        throw error; // Re-throw to be caught by the outer catch block
      }
    }

    // Generate a new unique id (using timestamp for simplicity)
    const newProjectWithId = {
      ...newProjectData,
      id: Date.now(), // Simple unique ID generation
    };

    // Add the new project to the array
    projects.push(newProjectWithId);

    // Write the updated projects array back to data/portfolio.json
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2), "utf-8");

    // Return the newly added project with a 201 status code
    return NextResponse.json(newProjectWithId, { status: 201 });

  } catch (error: any) {
    console.error("Error processing POST request for portfolio:", error);
    if (error instanceof SyntaxError) {
      // Error parsing request.json()
      return NextResponse.json(
        { error: "Invalid JSON payload in request." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred while adding the project." },
      { status: 500 }
    );
  }
}
