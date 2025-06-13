"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

const categories = ["Design", "Marketing", "Web"]; // Should match AddPortfolioPage

export default function AddPortfolioPage() {
  // Text field states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('');
  const [services, setServices] = useState(''); // Comma-separated string
  const [externalLink, setExternalLink] = useState('');

  // File states
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null);

  // Fallback URL states (optional, if you want to keep URL input as a secondary option)
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
    formData.append('services', services); // Send as comma-separated string, API will parse
    formData.append('externalLink', externalLink);

    if (mainImageFile) {
      formData.append('image', mainImageFile);
    } else if (mainImageUrl.trim() !== '') { // Fallback if file not selected but URL provided
      formData.append('image_url', mainImageUrl.trim());
    }

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (let i = 0; i < galleryImageFiles.length; i++) {
        formData.append('images', galleryImageFiles[i]);
      }
    } else if (galleryImageUrls.trim() !== '') { // Fallback
        formData.append('images_urls', galleryImageUrls.trim());
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData, // No Content-Type header needed for FormData
      });

      if (response.ok) {
        setMessage('Project added successfully! Redirecting...');
        // Reset form states
        setTitle(''); setCategory(categories[0]); setDescription(''); setClient(''); setYear(''); setServices(''); setExternalLink('');
        setMainImageFile(null); setGalleryImageFiles(null);
        setMainImageUrl(''); setGalleryImageUrls('');

        const form = event.target as HTMLFormElement;
        form.reset(); // Resets native form elements, including file inputs.

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
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Add New Portfolio Item</h1>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        {/* Category */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        {/* Description */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }} />
        </div>
        {/* Client */}
         <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="client" style={{ display: 'block', marginBottom: '0.5rem' }}>Client</label>
          <input type="text" id="client" value={client} onChange={(e) => setClient(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        {/* Year */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="year" style={{ display: 'block', marginBottom: '0.5rem' }}>Year</label>
          <input type="text" id="year" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        {/* Services */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="services" style={{ display: 'block', marginBottom: '0.5rem' }}>Services (comma-separated)</label>
          <input type="text" id="services" value={services} onChange={(e) => setServices(e.target.value)} placeholder="e.g., Web Design, Development" style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        {/* External Link */}
         <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="externalLink" style={{ display: 'block', marginBottom: '0.5rem' }}>External Link (optional)</label>
          <input type="url" id="externalLink" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://example.com" style={{ width: '100%', padding: '0.5rem' }} />
        </div>


        {/* Main Image File Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="imageFile" style={{ display: 'block', marginBottom: '0.5rem' }}>Main Image (File)</label>
          <input type="file" id="imageFile" name="imageFile" accept="image/*" onChange={handleMainImageChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        {/* Fallback Main Image URL Input (optional) */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="mainImageUrl" style={{ display: 'block', marginBottom: '0.5rem' }}>Or Main Image URL (Fallback)</label>
          <input type="text" id="mainImageUrl" value={mainImageUrl} onChange={(e) => setMainImageUrl(e.target.value)} placeholder="e.g., /images/project.png" style={{ width: '100%', padding: '0.5rem' }} />
        </div>


        {/* Gallery Images File Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="galleryImageFiles" style={{ display: 'block', marginBottom: '0.5rem' }}>Gallery Images (Files)</label>
          <input type="file" id="galleryImageFiles" name="galleryImageFiles" multiple accept="image/*" onChange={handleGalleryImagesChange} style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        {/* Fallback Gallery Image URLs Input (optional) */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="galleryImageUrls" style={{ display: 'block', marginBottom: '0.5rem' }}>Or Gallery Image URLs (Fallback, comma-separated)</label>
          <input type="text" id="galleryImageUrls" value={galleryImageUrls} onChange={(e) => setGalleryImageUrls(e.target.value)} placeholder="e.g., /img1.png, /img2.png" style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              backgroundColor: submitting ? '#b0b0b0' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {submitting ? 'Submitting...' : 'Add Project'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Failed') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}
