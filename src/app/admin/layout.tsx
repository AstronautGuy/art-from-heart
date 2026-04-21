import type { Metadata } from "next";
import Link from "next/link";
import { Package, FolderTree, Settings, Home } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Admin Dashboard - Art From Heart",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <span className="text-lg font-bold">Admin Portal</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
          >
            <Package className="h-5 w-5 text-gray-400" />
            Products
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
          >
            <FolderTree className="h-5 w-5 text-gray-400" />
            Categories
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-400" />
            Settings
          </Link>
        </nav>

        {/* Footer shortcuts */}
        <div className="border-t border-gray-200 p-4">
           <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-slate-900 hover:bg-gray-100 transition-colors"
          >
            <Home className="h-4 w-4" />
            Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1">
        <header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-8">
          <UserButton />
        </header>

        <div className="p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
