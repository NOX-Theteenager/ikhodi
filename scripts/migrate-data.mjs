// scripts/migrate-data.mjs
import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const jsonFilePath = path.join(process.cwd(), 'data', 'portfolio.json');

async function getDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

async function migrateData() {
  let connection;
  try {
    console.log('Starting data migration...');

    // Read JSON data
    let portfolioData = [];
    try {
      const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
      if (jsonData.trim() === '') {
        console.log('Source JSON file is empty. No data to migrate.');
        return;
      }
      portfolioData = JSON.parse(jsonData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('portfolio.json not found. No data to migrate.');
        return;
      }
      console.error('Error reading portfolio.json:', error);
      throw error;
    }

    if (!Array.isArray(portfolioData) || portfolioData.length === 0) {
      console.log('No projects found in JSON data. Migration not needed.');
      return;
    }

    connection = await getDbConnection();
    console.log('Successfully connected to the database.');

    // Optional: Clear existing data from the portfolio table before migration
    // await connection.execute('DELETE FROM portfolio');
    // console.log('Cleared existing data from portfolio table.');

    let migratedCount = 0;
    let skippedCount = 0;

    for (const project of portfolioData) {
      // Basic validation or transformation if needed
      const title = project.title;
      const category = project.category || null;
      const image = project.image || null;
      // Ensure images and services are arrays before stringifying
      const images = Array.isArray(project.images) ? JSON.stringify(project.images) : (project.images ? JSON.stringify([project.images]) : null);
      const description = project.description || null;
      const client = project.client || null;
      const year = project.year || null;
      const services = Array.isArray(project.services) ? JSON.stringify(project.services) : (project.services ? JSON.stringify([project.services]) : null);
      const externalLink = project.externalLink || null;
      const originalId = project.id; // Keep original ID for reference if needed, but DB will auto-increment

      try {
        // Check if a project with a similar title and client already exists to avoid duplicates (optional)
        // This is a simple check; more robust duplicate detection might be needed based on your data specifics.
        const [existing] = await connection.execute(
          'SELECT id FROM portfolio WHERE title = ? AND client = ?',
          [title, client]
        );
        if ((existing).length > 0) {
          console.warn(`Project with title "${title}" and client "${client}" (original ID: ${originalId}) might already exist. Skipping.`);
          skippedCount++;
          continue;
        }

        const [result] = await connection.execute(
          'INSERT INTO portfolio (title, category, image, images, description, client, year, services, externalLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [title, category, image, images, description, client, year, services, externalLink]
        );
        console.log(`Successfully migrated project: ${title} (Original ID: ${originalId}, New DB ID: ${result.insertId})`);
        migratedCount++;
      } catch (insertError) {
        console.error(`Error inserting project "${title}" (Original ID: ${originalId}):`, insertError.message);
        // Decide if you want to stop migration on first error or continue
        // For now, it continues and logs the error.
      }
    }

    console.log('\nMigration summary:');
    console.log(`Successfully migrated ${migratedCount} projects.`);
    console.log(`Skipped ${skippedCount} projects (potential duplicates or other reasons).`);

  } catch (error) {
    console.error('Data migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
    console.log('Migration process finished.');
  }
}

migrateData();
