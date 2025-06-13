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
          if(!data || typeof data.id === 'undefined') { // Check if data is null or not a project object
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
    // To allow clearing an image, send an empty image_url if mainImageFile is null AND projectData.image was cleared
    // This requires an explicit action from user to clear the projectData.image field in UI, not implemented here.
    // If mainImageFile is null, API will preserve old image unless image_url="" is sent.

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      for (let i = 0; i < galleryImageFiles.length; i++) {
        formData.append('images', galleryImageFiles[i]);
      }
    }
    // Similar logic for clearing gallery - requires explicit empty images_urls or specific signal.
    // If galleryImageFiles is null/empty, API will preserve old gallery unless images_urls=[] is sent.

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

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading project data...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>Error: {error} <br/> <Link href="/admin/portfolio" style={{color: '#007bff'}}>Back to Portfolio List</Link></div>;
  if (!projectData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Project not found or could not be loaded. <br/> <Link href="/admin/portfolio" style={{color: '#007bff'}}>Back to Portfolio List</Link></div>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{textAlign: 'center', color: '#333', marginBottom: '1.5rem'}}>Edit Portfolio Item (ID: {id})</h1>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Title:</label>
          <input type="text" id="title" name="title" value={projectData.title} onChange={handleTextChange} required style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Category:</label>
            <select id="category" name="category" value={projectData.category} onChange={handleTextChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Description:</label>
            <textarea id="description" name="description" value={projectData.description} onChange={handleTextChange} required style={{width: '100%', minHeight: '100px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="client" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Client:</label>
            <input type="text" id="client" name="client" value={projectData.client} onChange={handleTextChange} style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="year" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Year:</label>
            <input type="text" id="year" name="year" value={projectData.year} onChange={handleTextChange} style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="services" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Services (comma-separated):</label>
            <input type="text" id="services" name="services" value={servicesString} onChange={handleServicesChange} style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}> {/* Increased bottom margin */}
            <label htmlFor="externalLink" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>External Link:</label>
            <input type="url" id="externalLink" name="externalLink" value={projectData.externalLink} onChange={handleTextChange} placeholder="https://example.com" style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>


        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Current Main Image:</label>
          {projectData.image ?
            <img src={projectData.image} alt="Current main image" style={{ maxWidth: '200px', height: 'auto', display: 'block', marginBottom: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }} />
            : <p style={{color: '#777', fontStyle: 'italic'}}>No main image currently set.</p>}
          <label htmlFor="mainImageFile" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Upload New Main Image (replaces current):</label>
          <input type="file" id="mainImageFile" name="image" accept="image/*" onChange={handleMainImageChange} style={{ width: '100%', padding: '0.5rem' }}/>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Current Gallery Images:</label>
          {projectData.images && projectData.images.length > 0 ? (
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '0.75rem'}}>
              {projectData.images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`Gallery image ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
              ))}
            </div>
          ) : <p style={{color: '#777', fontStyle: 'italic'}}>No gallery images currently set.</p>}
          <label htmlFor="galleryImageFiles" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Upload New Gallery Images (replaces current gallery):</label>
          <input type="file" id="galleryImageFiles" name="images" multiple accept="image/*" onChange={handleGalleryImagesChange} style={{ width: '100%', padding: '0.5rem' }}/>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem'}}>
            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSubmitting ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                }}
            >
              {isSubmitting ? "Updating..." : "Update Project"}
            </button>
            <Link href="/admin/portfolio" style={{color: '#dc3545', textDecoration: 'none', fontWeight: 'bold'}}>Cancel</Link>
        </div>
      </form>
      {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: message.startsWith('Failed') || message.startsWith('An error') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}
