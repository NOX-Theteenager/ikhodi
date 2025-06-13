"use client";

import { useState, FormEvent } from 'react';

const categories = ["Design", "Marketing", "Web"]; // Match existing categories

export default function AddPortfolioPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState('');
  const [images, setImages] = useState(''); // Comma-separated URLs
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('');
  const [services, setServices] = useState(''); // Comma-separated
  const [externalLink, setExternalLink] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const projectData = {
      title,
      category,
      image,
      images: images.split(',').map(s => s.trim()).filter(s => s), // Split, trim, and filter empty strings
      description,
      client,
      year,
      services: services.split(',').map(s => s.trim()).filter(s => s), // Split, trim, and filter empty strings
      externalLink,
    };

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setMessage('Project added successfully!');
        // Reset form (optional)
        setTitle('');
        setCategory(categories[0]);
        setImage('');
        setImages('');
        setDescription('');
        setClient('');
        setYear('');
        setServices('');
        setExternalLink('');
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

        {/* Main Image URL */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '0.5rem' }}>Main Image URL</label>
          <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="e.g., /images/project.png" required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        {/* Gallery Images URLs (comma-separated) */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="images" style={{ display: 'block', marginBottom: '0.5rem' }}>Gallery Image URLs (comma-separated)</label>
          <input type="text" id="images" value={images} onChange={(e) => setImages(e.target.value)} placeholder="e.g., /images/img1.png, /images/img2.png" style={{ width: '100%', padding: '0.5rem' }} />
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

        {/* Services (comma-separated) */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="services" style={{ display: 'block', marginBottom: '0.5rem' }}>Services (comma-separated)</label>
          <input type="text" id="services" value={services} onChange={(e) => setServices(e.target.value)} placeholder="e.g., Web Design, Development" style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        {/* External Link */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="externalLink" style={{ display: 'block', marginBottom: '0.5rem' }}>External Link (optional)</label>
          <input type="url" id="externalLink" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://example.com" style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button type="submit" disabled={submitting} style={{ padding: '0.75rem 1.5rem', backgroundColor: submitting ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {submitting ? 'Submitting...' : 'Add Project'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Failed') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}
