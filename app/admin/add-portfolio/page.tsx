"use client";

import { useState, FormEvent } from "react";

const projectCategories = ["Design", "Marketing", "Web", "Autre"];

interface SubmitStatus {
  success: boolean;
  message: string;
}

export default function AddPortfolioItemPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // Form state for adding portfolio item
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(projectCategories[0]);
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [services, setServices] = useState("");
  const [image, setImage] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [images, setImages] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

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

  const handleProjectSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const servicesArray = services.split(",").map(s => s.trim()).filter(s => s);
    const imagesArray = images.split(",").map(url => url.trim()).filter(url => url);

    const newProject = {
      title,
      category,
      description,
      client,
      year,
      services: servicesArray,
      image,
      externalLink: externalLink || undefined,
      images: imagesArray.length > 0 ? imagesArray : undefined,
    };

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      const responseData = await response.json();
      if (response.ok && response.status === 201) {
        setSubmitStatus({ success: true, message: "Projet ajouté avec succès !" });
        setTitle("");
        setCategory(projectCategories[0]);
        setDescription("");
        setClient("");
        setYear(new Date().getFullYear().toString());
        setServices("");
        setImage("");
        setExternalLink("");
        setImages("");
      } else {
        setSubmitStatus({ success: false, message: responseData.error || "Erreur lors de l'ajout du projet." });
      }
    } catch (error: any) {
      setSubmitStatus({ success: false, message: error.message || "Une erreur réseau est survenue." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-rose-vif focus:border-rose-vif sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-lg shadow-xl">
          <div>
            <h2 className="mt-6 text-center text-2xl font-extrabold text-violet-fonce dark:text-rose-pale">
              Accès Administrateur
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className={`${labelClass} sr-only`}>Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`${inputClass} appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white dark:placeholder-gray-300 focus:outline-none focus:ring-rose-vif focus:border-rose-vif focus:z-10 sm:text-sm`}
                placeholder="Mot de passe"
                value={passwordAttempt}
                onChange={(e) => setPasswordAttempt(e.target.value)}
              />
            </div>

            {authError && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{authError}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isCheckingPassword}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-fonce hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
              >
                {isCheckingPassword ? "Vérification..." : "Se Connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // If authenticated, render the project form
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-violet-fonce dark:text-rose-pale">
            Ajouter un Projet
          </h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPasswordAttempt(""); // Clear password attempt for security
              setAuthError(null);
            }}
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            Se déconnecter
          </button>
        </div>
        <form onSubmit={handleProjectSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
          <div>
            <label htmlFor="title" className={labelClass}>Titre du Projet <span className="text-red-500">*</span></label>
            <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>Catégorie <span className="text-red-500">*</span></label>
            <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass}>
              {projectCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description <span className="text-red-500">*</span></label>
            <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputClass}></textarea>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>URL de l'Image Principale <span className="text-red-500">*</span></label>
            <input type="url" name="image" id="image" value={image} onChange={(e) => setImage(e.target.value)} required className={inputClass} placeholder="https://example.com/image.png"/>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Doit être une URL valide.</p>
          </div>

          <div>
            <label htmlFor="client" className={labelClass}>Client</label>
            <input type="text" name="client" id="client" value={client} onChange={(e) => setClient(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label htmlFor="year" className={labelClass}>Année de Réalisation</label>
            <input type="number" name="year" id="year" value={year} onChange={(e) => setYear(e.target.value)} className={inputClass} placeholder="YYYY"/>
          </div>

          <div>
            <label htmlFor="services" className={labelClass}>Services Fournis</label>
            <input type="text" name="services" id="services" value={services} onChange={(e) => setServices(e.target.value)} className={inputClass} />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Entrez les services séparés par des virgules (ex: Design, Développement, SEO).</p>
          </div>

          <div>
            <label htmlFor="images" className={labelClass}>URLs des Images de la Galerie</label>
            <textarea name="images" id="images" value={images} onChange={(e) => setImages(e.target.value)} rows={3} className={inputClass} placeholder="https://example.com/gallery1.png, https://example.com/gallery2.png"></textarea>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Entrez les URLs séparées par des virgules.</p>
          </div>

          <div>
            <label htmlFor="externalLink" className={labelClass}>Lien Externe du Projet</label>
            <input type="url" name="externalLink" id="externalLink" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} className={inputClass} placeholder="https://example.com/project-details"/>
          </div>

          {submitStatus && (
            <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
              <p>{submitStatus.message}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-vif hover:bg-rouge-framboise focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-vif disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le Projet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
