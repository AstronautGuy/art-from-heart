"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Loader2, Trash2, Plus, X, Edit2, AlertCircle } from "lucide-react";
import { Tabs } from "@/app/_components/admin/Tabs";
import { R2Uploader } from "@/app/_components/admin/R2Uploader";
import { RichTextEditor } from "@/app/_components/admin/RichTextEditor";

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockType, setStockType] = useState<"limited" | "made_to_order">("limited");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [freeShipping, setFreeShipping] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const utils = api.useUtils();
  const { data: products, isLoading } = api.admin.getProducts.useQuery();
  const { data: categories } = api.admin.getCategories.useQuery();

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setStockType("limited");
    setStockQuantity("0");
    setFreeShipping(false);
    setFeatured(false);
    setImages([]);
    setFormError("");
    setEditingProductId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (product: any) => {
    resetForm();
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice((product.price / 100).toString());
    setCategoryId(product.categoryId);
    setStockType(product.stockType);
    setStockQuantity(product.stockQuantity.toString());
    setFreeShipping(product.freeShippingEligible);
    setFeatured(product.featured);
    setImages(product.images);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const createMutation = api.admin.createProduct.useMutation({
    onSuccess: () => {
      closeForm();
      void utils.admin.getProducts.invalidate();
    },
  });

  const updateMutation = api.admin.updateProduct.useMutation({
    onSuccess: () => {
      closeForm();
      void utils.admin.getProducts.invalidate();
    },
  });

  const deleteMutation = api.admin.deleteProduct.useMutation({
    onSuccess: () => {
      void utils.admin.getProducts.invalidate();
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || name.trim() === "") {
      setFormError("Product Name is required (Basic Info tab).");
      return;
    }
    if (!categoryId) {
      setFormError("Category is required (Basic Info tab).");
      return;
    }
    if (!price || isNaN(parseFloat(price))) {
      setFormError("A valid Price must be provided (Pricing & Stock tab).");
      return;
    }

    const payload = {
      name,
      description,
      price: Math.round(parseFloat(price) * 100), // convert to cents
      categoryId,
      stockType,
      stockQuantity: parseInt(stockQuantity) || 0,
      freeShippingEligible: freeShipping,
      featured,
      images,
    };

    if (editingProductId) {
      updateMutation.mutate({ id: editingProductId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setImages(images.filter((url) => url !== urlToRemove));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your store's inventory and listings.</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingProductId ? "Edit Product" : "Create New Product"}
            </h2>
            <button
              onClick={closeForm}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form id="product-form" onSubmit={handleSave}>
            {formError && (
               <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-800 border border-red-200">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{formError}</span>
               </div>
            )}

            <Tabs
              tabs={[
                { id: "basic", label: "Basic Info" },
                { id: "pricing", label: "Pricing & Stock" },
                { id: "images", label: "Images" },
              ]}
            >
              {(activeTab) => (
                <div className="py-4">
                  {/* BASIC INFO TAB */}
                  <div className={activeTab === "basic" ? "block space-y-4" : "hidden"}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          placeholder="Resin Coaster"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                        >
                          <option value="" disabled>Select a category</option>
                          {categories?.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                      />
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="rounded border-gray-300 text-slate-800 focus:ring-slate-800"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Item</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={freeShipping}
                          onChange={(e) => setFreeShipping(e.target.checked)}
                          className="rounded border-gray-300 text-slate-800 focus:ring-slate-800"
                        />
                        <span className="text-sm font-medium text-gray-700">Eligible for Free Shipping</span>
                      </label>
                    </div>
                  </div>

                  {/* PRICING & STOCK TAB */}
                  <div className={activeTab === "pricing" ? "block space-y-4" : "hidden"}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          placeholder="599.00"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Stock Type</label>
                         <select
                          value={stockType}
                          onChange={(e) => setStockType(e.target.value as "limited" | "made_to_order")}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                        >
                          <option value="limited">Limited Quantity</option>
                          <option value="made_to_order">Made to Order (Unlimited)</option>
                        </select>
                      </div>
                    </div>
                    
                    {stockType === "limited" && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Available Quantity</label>
                        <input
                          type="number"
                          min="0"
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(e.target.value)}
                          className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* IMAGES TAB */}
                  <div className={activeTab === "images" ? "block space-y-4" : "hidden"}>
                    {images.length > 0 && (
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Attached Images</label>
                        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                          {images.map((url) => (
                            <div key={url} className="group relative aspect-square rounded-lg border border-gray-200">
                              <img src={url} alt="Attached" className="h-full w-full rounded-lg object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <label className="mb-2 block text-sm font-medium text-gray-700">Upload New Images</label>
                    <R2Uploader
                      maxFiles={5}
                      onUploadSuccess={(urls) => setImages((prev) => [...prev, ...urls])}
                    />
                  </div>
                </div>
              )}
            </Tabs>

            <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end">
               <button
                form="product-form"
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-md bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProductId ? "Update Product" : "Save Full Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </td>
              </tr>
            )}
            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No products exist yet. Click Add Product to get started.
                </td>
              </tr>
            )}
            {products?.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                       {product.images[0] ? (
                         product.images[0].match(/\.(mp4|webm|mov|ogg)$/i) ? (
                           <video className="h-10 w-10 rounded-md object-cover border border-gray-200" src={product.images[0]} muted loop playsInline />
                         ) : (
                           <img className="h-10 w-10 rounded-md object-cover border border-gray-200" src={product.images[0]} alt="" />
                         )
                       ) : (
                         <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                       )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.featured ? "Featured" : ""}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {product.category?.name ?? "Uncategorized"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 text-right">
                  {(product.price / 100).toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-right">
                  {product.stockType === "made_to_order" ? (
                    <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">Made to Order</span>
                  ) : (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stockQuantity > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {product.stockQuantity} in stock
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => openEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 inline-block" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                        deleteMutation.mutate({ id: product.id });
                      }
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
