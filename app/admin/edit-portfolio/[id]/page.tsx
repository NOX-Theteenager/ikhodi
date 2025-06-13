"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const categories = ["Design", "Marketing", "Web"];

interface ProjectState {
  id: number | null;
  title: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  client: string;
  year: string;
  services: string[];
  externalLink: string;
}

export default function EditPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [projectData, setProjectData] = useState<ProjectState | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null);
  const [servicesString, setServicesString] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError('');
      fetch(`/api/portfolio/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch project (status: ${res.status})`);
          }
          return res.json();
        })
        .then((data: ProjectState) => {
          if(!data || typeof data.id === 'undefined') {
            throw new Error("Fetched data is not a valid project.");
          }
          setProjectData(data);
          setServicesString(Array.isArray(data.services) ? data.services.join(', ') : '');
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching project:", err);
          setError(err.message || "Could not load project data.");
          setIsLoading(false);
        });
    } else {
      setError("No project ID provided.");
      setIsLoading(false);
    }
  }, [id]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!projectData) return;
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleServicesChange = (e: ChangeEvent<HTMLInputElement>) => {
      setServicesString(e.target.value);
      if(projectData) {
          setProjectData({...projectData, services: e.target.value.split(',').map(s => s.trim()).filter(s => s) });
      }
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMainImageFile(e.target.files?.[0] || null);
  };

  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGalleryImageFiles(e.target.files || null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !projectData) {
      setMessage("Project data or ID is missing.");
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    const formData = new FormData();
    formData.append('title', projectData.title);
    formData.append('category', projectData.category);
    formData.append('description', projectData.description);
    formData.append('client', projectData.client);
    formData.append('year', projectData.year);
    formData.append('services', projectData.services.join(','));
    formData.append('externalLink', projectData.externalLink);

    if (mainImageFile) {
      formData.append('image', mainImageFile);
    }

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (let i = 0; i < galleryImageFiles.length; i++) {
        formData.append('images', galleryImageFiles[i]);
      }
    }

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        setMessage('Project updated successfully! Redirecting...');
        setTimeout(() => router.push('/admin/portfolio'), 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setMessage('An error occurred while submitting the form: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center p-10 text-gray-700 dark:text-gray-300">Loading project data...</div>;
  if (error) return <div className="text-center p-10 text-red-600 dark:text-red-400">Error: {error} <br/> <Link href="/admin/portfolio" className="text-violet-600 hover:underline dark:text-violet-400 dark:hover:underline">Back to Portfolio List</Link></div>;
  if (!projectData) return <div className="text-center p-10 text-gray-700 dark:text-gray-300">Project not found or could not be loaded. <br/> <Link href="/admin/portfolio" className="text-violet-600 hover:underline dark:text-violet-400 dark:hover:underline">Back to Portfolio List</Link></div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Portfolio Item <span className="text-base font-normal text-gray-500 dark:text-gray-400">(ID: {id})</span>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input type="text" id="title" name="title" value={projectData.title} onChange={handleTextChange} required
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select id="category" name="category" value={projectData.category} onChange={handleTextChange}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="description" name="description" value={projectData.description} onChange={handleTextChange} required
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" style={{minHeight: '100px'}}/>
        </div>

        <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
            <input type="text" id="client" name="client" value={projectData.client} onChange={handleTextChange}
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
            <input type="text" id="year" name="year" value={projectData.year} onChange={handleTextChange}
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
            <label htmlFor="services" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services (comma-separated)</label>
            <input type="text" id="services" name="services" value={servicesString} onChange={handleServicesChange}
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
            <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">External Link</label>
            <input type="url" id="externalLink" name="externalLink" value={projectData.externalLink} onChange={handleTextChange} placeholder="https://example.com"
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Main Image</label>
          {projectData.image ? (
            <img src={projectData.image} alt="Current main image" className="max-w-xs max-h-48 rounded-md shadow-sm object-contain border border-gray-200 dark:border-gray-700 mb-2" />
          ) : <p className="text-sm text-gray-500 dark:text-gray-400 italic">No main image.</p>}
          <label htmlFor="mainImageFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 pt-2">Upload New Main Image (replaces current)</label>
          <input type="file" id="mainImageFile" name="image" accept="image/*" onChange={handleMainImageChange}
                 className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2.5"/>
        </div>

        <div className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Gallery Images</label>
          {projectData.images && projectData.images.length > 0 ? (
            <div className="flex flex-wrap gap-3 items-start mb-2">
              {projectData.images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`Gallery image ${index + 1}`} className="w-24 h-24 rounded-md shadow-sm object-cover border border-gray-200 dark:border-gray-700" />
              ))}
            </div>
          ) : <p className="text-sm text-gray-500 dark:text-gray-400 italic">No gallery images.</p>}
          <label htmlFor="galleryImageFiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 pt-2">Upload New Gallery Images (replaces current gallery)</label>
          <input type="file" id="galleryImageFiles" name="images" multiple accept="image/*" onChange={handleGalleryImagesChange}
                 className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2.5"/>
        </div>

        <div className="flex items-center justify-between pt-4">
            <button type="submit" disabled={isSubmitting}
                    className="inline-flex justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-400 dark:disabled:bg-gray-500">
              {isSubmitting ? "Updating..." : "Update Project"}
            </button>
            <Link href="/admin/portfolio" className="text-sm font-medium text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-500 hover:underline">
              Cancel
            </Link>
        </div>
      </form>
      {message && (
         <p className={`mt-4 text-sm p-3 rounded-md ${message.startsWith('Failed') || message.startsWith('An error') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
