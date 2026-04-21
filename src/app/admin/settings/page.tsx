"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { Loader2, Trash2 } from "lucide-react";
import { R2Uploader } from "@/app/_components/admin/R2Uploader";

export default function SettingsPage() {
  const [config, setConfig] = useState<any>({
    freeShippingThreshold: 500, // stored in rupees/cents depending on preference
    banners: [],
  });

  const utils = api.useUtils();
  const { data: settings, isLoading } = api.admin.getSettings.useQuery();

  useEffect(() => {
    if (settings?.config) {
      setConfig(settings.config);
    }
  }, [settings]);

  const upsertMutation = api.admin.upsertSettings.useMutation({
    onSuccess: () => {
      void utils.admin.getSettings.invalidate();
      alert("Settings saved!");
    },
  });

  const handleSave = () => {
    upsertMutation.mutate({ config });
  };

  const removeBanner = (url: string) => {
    setConfig((prev: any) => ({
      ...prev,
      banners: prev.banners.filter((b: string) => b !== url),
    }));
  };

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin text-gray-500" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Global Settings</h1>
        <p className="text-gray-500">Configure store-wide rules and visual banners.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={config.freeShippingThreshold || ""}
              onChange={(e) =>
                setConfig({ ...config, freeShippingThreshold: parseInt(e.target.value) || 0 })
              }
              className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
            <p className="mt-1 text-xs text-gray-500">Orders above this amount automatically receive free shipping.</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
             <label className="mb-3 block text-sm font-medium text-gray-700">
              Store Banners
            </label>
            
            {config.banners && config.banners.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {config.banners.map((bannerUrl: string) => (
                  <div key={bannerUrl} className="relative group rounded-md overflow-hidden border border-gray-200">
                    <img src={bannerUrl} alt="Banner" className="w-full h-32 object-cover object-center" />
                    <button
                      onClick={() => removeBanner(bannerUrl)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <R2Uploader
              maxFiles={3}
              onUploadSuccess={(urls) => {
                setConfig((prev: any) => ({
                  ...prev,
                  banners: [...(prev.banners || []), ...urls],
                }));
              }}
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleSave}
              disabled={upsertMutation.isPending}
              className="flex justify-center items-center rounded-md bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
            >
              {upsertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
