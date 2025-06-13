"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  client?: string;
  year?: string;
  image?: string;
  images?: string[];
  services?: string[];
  externalLink?: string;
}

export default function AdminPortfolioListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Optional: state for feedback messages on delete
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


  useEffect(() => {
    // ... (fetchProjects logic remains the same) ...
    const fetchProjects = async () => {
      setIsLoading(true);
      setFeedbackMessage(null); // Clear previous feedback
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch projects:", e);
        setError(e.message || "Failed to load projects.");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    setFeedbackMessage(null); // Clear previous feedback
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
          setFeedbackMessage('Project deleted successfully.');
          // Auto-clear feedback after a few seconds
          setTimeout(() => setFeedbackMessage(null), 3000);
        } else {
          const errorData = await response.json();
          console.error('Failed to delete project:', errorData);
          setError(`Failed to delete project: ${errorData.message || 'Server error'}`);
          setFeedbackMessage(`Error: ${errorData.message || 'Could not delete project.'}`);
        }
      } catch (e: any) {
        console.error('Error deleting project:', e);
        setError('An unexpected error occurred while deleting the project.');
        setFeedbackMessage('Error: An unexpected error occurred.');
      }
    }
  };

  // ... (JSX for heading, Add New Project button, loading/error states for initial load) ...

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem' }}>
      {/* ... (heading and Add New Project link) ... */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Portfolio Projects</h1>
        <Link href="/admin/add-portfolio" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Add New Project
        </Link>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>Error loading projects: {error}</p>}
      {feedbackMessage && <p style={{ color: feedbackMessage.startsWith('Error:') ? 'red' : 'green', margin: '1rem 0' }}>{feedbackMessage}</p>}


      {!isLoading && !error && projects.length === 0 && (
         <p>No projects found. <Link href="/admin/add-portfolio">Add the first one!</Link></p>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {/* ... (thead remains the same) ... */}
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Category</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Client</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Year</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.category}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.client || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.year || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', whiteSpace: 'nowrap' }}>
                  <Link
                    href={`/admin/edit-portfolio/${project.id}`}
                    style={{ color: '#007bff', textDecoration: 'none', marginRight: '10px' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{ color: 'red', background: 'none', border: 'none', padding: '0', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
