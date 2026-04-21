"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Loader2, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const [featured, setFeatured] = useState(false);

  const utils = api.useUtils();
  const { data: categories, isLoading } = api.admin.getCategories.useQuery();

  const createMutation = api.admin.createCategory.useMutation({
    onSuccess: () => {
      setName("");
      setFeatured(false);
      void utils.admin.getCategories.invalidate();
    },
  });

  const deleteMutation = api.admin.deleteCategory.useMutation({
    onSuccess: () => {
      void utils.admin.getCategories.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, featured });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categories</h1>
        <p className="text-gray-500">Manage how products are grouped in your store.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* CREATE FORM */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Add Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                placeholder="e.g. Resin Keychains"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300 text-slate-800 focus:ring-slate-800"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured category
              </label>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
              className="w-full flex justify-center items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Category"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm md:col-span-2 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {categories?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No categories exist yet.
                  </td>
                </tr>
              )}
              {categories?.map((category) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 text-center">
                    {category.featured ? (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 text-xs font-semibold leading-5 text-emerald-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-500">
                        No
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${category.name}?`)) {
                          deleteMutation.mutate({ id: category.id });
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete category"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
