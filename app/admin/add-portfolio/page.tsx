"use client";

import { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { Eye, Edit3, Trash2, PlusCircle, List, XCircle, Save } from "lucide-react"; // Added XCircle, Save

const projectCategories = ["Design", "Marketing", "Web", "Autre"];

interface SubmitStatus {
  success: boolean;
  message: string;
}

interface Project {
  id: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  client?: string;
  year?: string;
  services?: string[];
  externalLink?: string;
}

export default function AddPortfolioItemPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentCategory, setCurrentCategory] = useState(projectCategories[0]);
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentClient, setCurrentClient] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [currentServices, setCurrentServices] = useState("");
  const [currentMainImage, setCurrentMainImage] = useState<File | null>(null);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<FileList | null>(null);
  const [currentExternalLink, setCurrentExternalLink] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);


  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [loadProjectsError, setLoadProjectsError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    setLoadProjectsError(null);
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (error: any) {
      setLoadProjectsError(error.message || "Failed to load projects.");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setProjects([]); // Clear projects if not authenticated
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setIsCheckingPassword(true);
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordAttempt }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || "Failed to authenticate.");
      }
    } catch (error) {
      setAuthError("Network error or server unavailable.");
    } finally {
      setIsCheckingPassword(false);
    }
  };

  const resetForm = () => {
    setCurrentTitle("");
    setCurrentCategory(projectCategories[0]);
    setCurrentDescription("");
    setCurrentClient("");
    setCurrentYear(new Date().getFullYear().toString());
    setCurrentServices("");
    setCurrentMainImage(null);
    setCurrentGalleryImages(null);
    setCurrentExternalLink("");
    setEditingProject(null);
    setSubmitStatus(null);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setCurrentTitle(project.title);
    setCurrentCategory(project.category);
    setCurrentDescription(project.description);
    setCurrentClient(project.client || "");
    setCurrentYear(project.year || new Date().getFullYear().toString());
    setCurrentServices(project.services?.join(", ") || "");
    setCurrentExternalLink(project.externalLink || "");
    setCurrentMainImage(null); // Reset file input
    setCurrentGalleryImages(null); // Reset file input
    setSubmitStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const handleProjectSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    formData.append('title', currentTitle);
    formData.append('category', currentCategory);
    formData.append('description', currentDescription);
    formData.append('client', currentClient);
    formData.append('year', currentYear);
    formData.append('services', currentServices);
    formData.append('externalLink', currentExternalLink);

    if (currentMainImage instanceof File) {
      formData.append('image', currentMainImage);
    }

    if (currentGalleryImages) {
      for (let i = 0; i < currentGalleryImages.length; i++) {
        formData.append('images', currentGalleryImages[i]);
      }
    }

    let apiUrl = '/api/portfolio';
    let apiMethod = 'POST';

    if (editingProject) {
      apiUrl = `/api/portfolio/${editingProject.id}`;
      apiMethod = 'PUT';
    }

    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        body: formData,
      });
      const responseData = await response.json();

      if (response.ok) {
        setSubmitStatus({ success: true, message: `Projet ${editingProject ? 'mis à jour' : 'ajouté'} avec succès !` });
        resetForm();
        fetchProjects();
      } else {
        setSubmitStatus({ success: false, message: responseData.error || `Erreur lors de ${editingProject ? "la mise à jour" : "l'ajout"} du projet.` });
      }
    } catch (error: any) {
      setSubmitStatus({ success: false, message: error.message || "Une erreur réseau est survenue." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (projectId: string | number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      return;
    }
    setDeletingId(projectId);
    setSubmitStatus(null);
    try {
      const response = await fetch(`/api/portfolio/${projectId}`, { method: 'DELETE' });
      const responseData = await response.json();

      if (response.ok) {
        setSubmitStatus({ success: true, message: responseData.message || "Projet supprimé avec succès !" });
        fetchProjects();
        if (editingProject?.id === projectId) {
          resetForm();
        }
      } else {
        throw new Error(responseData.message || "Erreur lors de la suppression du projet.");
      }
    } catch (error: any) {
      setSubmitStatus({ success: false, message: error.message || "Une erreur réseau est survenue." });
    } finally {
      setDeletingId(null);
    }
  };


  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-rose-vif focus:border-rose-vif sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-lg shadow-xl">
          <div><h2 className="mt-6 text-center text-2xl font-extrabold text-violet-fonce dark:text-rose-pale">Accès Administrateur Portfolio</h2></div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className={`${labelClass} sr-only`}>Mot de passe</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={`${inputClass} appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:placeholder-gray-300 focus:outline-none focus:ring-rose-vif focus:border-rose-vif focus:z-10 sm:text-sm`}
                placeholder="Mot de passe" value={passwordAttempt} onChange={(e) => setPasswordAttempt(e.target.value)} />
            </div>
            {authError && (<p className="text-sm text-red-600 dark:text-red-400 text-center">{authError}</p>)}
            <div>
              <button type="submit" disabled={isCheckingPassword} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-fonce hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 dark:focus:ring-offset-gray-800">
                {isCheckingPassword ? "Vérification..." : "Se Connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-violet-fonce dark:text-rose-pale flex items-center"><List className="mr-3 h-8 w-8"/> Gérer le Portfolio</h1>
          <button onClick={() => { setIsAuthenticated(false); setPasswordAttempt(""); setAuthError(null); setProjects([]); resetForm(); }}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline">Se déconnecter</button>
        </div>

        <div className="mb-12 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-violet-fonce dark:text-rose-pale flex items-center">
              {editingProject ? <Edit3 className="mr-2 h-6 w-6"/> : <PlusCircle className="mr-2 h-6 w-6"/>}
              {editingProject ? "Modifier le Projet" : "Ajouter un Nouveau Projet"}
            </h2>
            {editingProject && (
              <button onClick={resetForm} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center">
                <XCircle className="mr-1 h-4 w-4"/> Annuler la Modification
              </button>
            )}
          </div>
          <form onSubmit={handleProjectSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className={labelClass}>Titre du Projet <span className="text-red-500">*</span></label>
              <input type="text" name="title" id="title" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} required className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className={labelClass}>Catégorie <span className="text-red-500">*</span></label>
                <select name="category" id="category" value={currentCategory} onChange={(e) => setCurrentCategory(e.target.value)} required className={inputClass}>
                  {projectCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className={labelClass}>Année de Réalisation</label>
                <input type="number" name="year" id="year" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} className={inputClass} placeholder="YYYY"/>
              </div>
            </div>
            <div>
              <label htmlFor="description" className={labelClass}>Description <span className="text-red-500">*</span></label>
              <textarea name="description" id="description" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} required rows={4} className={inputClass}></textarea>
            </div>
            <div>
              <label htmlFor="imageFile" className={labelClass}>Image Principale {editingProject ? "(Optionnel pour modifier)" : <span className="text-red-500">*</span>}</label>
              {editingProject?.image && !currentMainImage && (
                <div className="mt-2 mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Image actuelle:</p>
                  <img src={editingProject.image} alt="Image principale actuelle" className="h-20 w-auto rounded-md shadow"/>
                </div>
              )}
              <input type="file" name="imageFile" id="imageFile" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentMainImage(e.target.files?.[0] || null)} className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-gray-700 dark:file:text-violet-300 dark:hover:file:bg-gray-600`} />
            </div>
            <div>
              <label htmlFor="galleryFiles" className={labelClass}>Images de la Galerie (Optionnel)</label>
              {editingProject?.images && editingProject.images.length > 0 && (
                <div className="mt-2 mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Images de galerie actuelles:</p>
                  <div className="flex space-x-2 overflow-x-auto py-2">
                    {editingProject.images.map((imgUrl, idx) => (
                      <img key={idx} src={imgUrl} alt={`Galerie image ${idx + 1}`} className="h-20 w-auto rounded-md shadow"/>
                    ))}
                  </div>
                </div>
              )}
              <input type="file" name="galleryFiles" id="galleryFiles" multiple accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentGalleryImages(e.target.files)} className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-gray-700 dark:file:text-violet-300 dark:hover:file:bg-gray-600`} />
            </div>
            <div>
              <label htmlFor="client" className={labelClass}>Client (Optionnel)</label>
              <input type="text" name="client" id="client" value={currentClient} onChange={(e) => setCurrentClient(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="services" className={labelClass}>Services Fournis (Optionnel)</label>
              <input type="text" name="services" id="services" value={currentServices} onChange={(e) => setCurrentServices(e.target.value)} className={inputClass} />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Entrez les services séparés par des virgules.</p>
            </div>
            <div>
              <label htmlFor="externalLink" className={labelClass}>Lien Externe du Projet (Optionnel)</label>
              <input type="url" name="externalLink" id="externalLink" value={currentExternalLink} onChange={(e) => setCurrentExternalLink(e.target.value)} className={inputClass} placeholder="https://example.com/project-details"/>
            </div>

            {submitStatus && (
              <div className={`p-4 my-4 rounded-md ${submitStatus.success ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
                <p>{submitStatus.message}</p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button type="submit" disabled={isSubmitting}
                className="flex items-center justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-vif hover:bg-rouge-framboise focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-vif disabled:opacity-50 dark:focus:ring-offset-gray-800">
                {editingProject ? <Save className="mr-2 h-5 w-5"/> : <PlusCircle className="mr-2 h-5 w-5"/>}
                {isSubmitting ? "Enregistrement..." : (editingProject ? "Mettre à jour le Projet" : "Ajouter le Projet")}
              </button>
              {editingProject && (
                <button type="button" onClick={resetForm} disabled={isSubmitting}
                  className="flex items-center justify-center py-2.5 px-5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-violet-fonce dark:text-rose-pale mb-6 flex items-center"><List className="mr-2 h-6 w-6"/> Liste des Projets Existants</h2>
            {isLoadingProjects && <p className="text-center py-4 text-gray-600 dark:text-gray-300">Chargement des projets...</p>}
            {loadProjectsError && <p className="text-center py-4 text-red-500 dark:text-red-400">Erreur: {loadProjectsError}</p>}
            {!isLoadingProjects && !loadProjectsError && projects.length === 0 && (
                <p className="text-center py-4 text-gray-600 dark:text-gray-300">Aucun projet trouvé.</p>
            )}
            {!isLoadingProjects && !loadProjectsError && projects.length > 0 && (
                <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3 md:mb-0 flex-grow">
                            {project.image && (<img src={project.image} alt={project.title} className="w-16 h-16 object-cover rounded-md mr-4 shadow flex-shrink-0"/>)}
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-violet-fonce dark:text-rose-pale">{project.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{project.category} - {project.year}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">ID: {project.id}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0">
                            <button onClick={() => handleEditClick(project)} disabled={deletingId === project.id || isSubmitting}
                                className="p-2 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 transition-colors">
                                <Edit3 className="h-5 w-5"/>
                            </button>
                            <button onClick={() => handleDeleteClick(project.id)} disabled={deletingId === project.id || isSubmitting}
                                className="p-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors">
                                {deletingId === project.id ? <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" role="status" aria-label="suppression..."></span> : <Trash2 className="h-5 w-5"/>}
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
