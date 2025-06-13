"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const categories = ["Design", "Marketing", "Web"];

export default function AddPortfolioPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('');
  const [services, setServices] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [galleryImageUrls, setGalleryImageUrls] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMainImageFile(e.target.files?.[0] || null);
  };

  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGalleryImageFiles(e.target.files || null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('client', client);
    formData.append('year', year);
    formData.append('services', services);
    formData.append('externalLink', externalLink);

    if (mainImageFile) {
      formData.append('image', mainImageFile);
    } else if (mainImageUrl.trim() !== '') {
      formData.append('image_url', mainImageUrl.trim());
    }

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (let i = 0; i < galleryImageFiles.length; i++) {
        formData.append('images', galleryImageFiles[i]);
      }
    } else if (galleryImageUrls.trim() !== '') {
        formData.append('images_urls', galleryImageUrls.trim());
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setMessage('Project added successfully! Redirecting...');
        setTitle(''); setCategory(categories[0]); setDescription(''); setClient(''); setYear(''); setServices(''); setExternalLink('');
        setMainImageFile(null); setGalleryImageFiles(null);
        setMainImageUrl(''); setGalleryImageUrls('');
        const form = event.target as HTMLFormElement;
        form.reset();
        setTimeout(() => router.push('/admin/portfolio'), 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add project: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('An error occurred while submitting the form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Add New Portfolio Item
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" style={{ minHeight: '100px' }}/>
        </div>

        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
          <input type="text" id="client" value={client} onChange={(e) => setClient(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <input type="text" id="year" value={year} onChange={(e) => setYear(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="services" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services (comma-separated)</label>
          <input type="text" id="services" value={services} onChange={(e) => setServices(e.target.value)} placeholder="e.g., Web Design, Development"
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">External Link (optional)</label>
          <input type="url" id="externalLink" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://example.com"
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Image (File)</label>
          <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleMainImageChange}
                 className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2.5"/>
        </div>

        <div>
          <label htmlFor="mainImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or Main Image URL (Fallback)</label>
          <input type="text" id="mainImageUrl" value={mainImageUrl} onChange={(e) => setMainImageUrl(e.target.value)} placeholder="e.g., /images/project.png"
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="galleryImageFiles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gallery Images (Files)</label>
          <input type="file" id="galleryImageFiles" name="galleryImageFiles" multiple accept="image/*" onChange={handleGalleryImagesChange}
                 className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none p-2.5"/>
        </div>

        <div>
          <label htmlFor="galleryImageUrls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or Gallery Image URLs (Fallback, comma-separated)</label>
          <input type="text" id="galleryImageUrls" value={galleryImageUrls} onChange={(e) => setGalleryImageUrls(e.target.value)} placeholder="e.g., /img1.png, /img2.png"
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" />
        </div>

        <button type="submit" disabled={submitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-400 dark:disabled:bg-gray-500">
          {submitting ? 'Submitting...' : 'Add Project'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm p-3 rounded-md ${message.startsWith('Failed') || message.startsWith('An error') ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
