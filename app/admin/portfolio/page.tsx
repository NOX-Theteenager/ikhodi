"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
// useRouter is removed as logout is handled by layout

interface Project {
  id: number;
  title: string;
  category: string;
  description: string; // Keep for interface consistency, though not displayed in list
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
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setFeedbackMessage(null);
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
    setFeedbackMessage(null);
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/portfolio/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
          setFeedbackMessage('Project deleted successfully.');
          setTimeout(() => setFeedbackMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setFeedbackMessage(`Error: ${errorData.message || 'Could not delete project.'}`);
        }
      } catch (e: any) {
        setFeedbackMessage('Error: An unexpected error occurred while deleting the project.');
      }
    }
  };

  return (
    <> {/* Using Fragment as AdminLayout provides the main div */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Portfolio Projects
        </h1>
        {/* "Add New Project" button is in AdminLayout's header now */}
      </div>

      {feedbackMessage && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${feedbackMessage.startsWith('Error:') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`} role="alert">
          {feedbackMessage}
        </div>
      )}

      {isLoading && <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>}
      {error && !isLoading && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300" role="alert">
          Error loading projects: {error}
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
         <p className="text-gray-600 dark:text-gray-400">
           No projects found.
           <Link href="/admin/add-portfolio" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-500 font-medium"> Add the first one!</Link>
         </p>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="shadow-lg overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{project.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{project.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{project.client || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{project.year || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      href={`/admin/edit-portfolio/${project.id}`}
                      className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
