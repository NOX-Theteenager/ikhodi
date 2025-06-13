"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/admin/login');
      } else {
        console.error("Logout failed:", await response.json());
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred during logout.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-violet-600 dark:bg-violet-800 text-white shadow-md">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <Link href="/admin/portfolio" className="text-xl font-bold hover:text-rose-300 dark:hover:text-rose-200">
              Admin Panel
            </Link>
          </div>
          <div className="space-x-4">
            <Link href="/admin/portfolio" className="hover:text-rose-300 dark:hover:text-rose-200">
              Portfolio List
            </Link>
            <Link href="/admin/add-portfolio" className="hover:text-rose-300 dark:hover:text-rose-200">
              Add Project
            </Link>
            <button
              onClick={handleLogout}
              className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white py-2 px-3 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
      <footer className="text-center py-4 border-t border-gray-300 dark:border-gray-700 mt-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} Your Site Name - Admin</p>
      </footer>
    </div>
  );
}
