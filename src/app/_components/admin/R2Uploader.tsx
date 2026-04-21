"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";

interface R2UploaderProps {
  onUploadSuccess: (urls: string[]) => void;
  maxFiles?: number;
}

export function R2Uploader({ onUploadSuccess, maxFiles = 5 }: R2UploaderProps) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getPresignedUrl = api.admin.createPresignedUrl.useMutation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images.`);
        return;
      }
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [files, maxFiles]
  );

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((f) => f.name !== name));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // 1. Get Presigned URL
        const res = await getPresignedUrl.mutateAsync({
          filename: file.name,
          contentType: file.type,
        });

        // 2. Upload file directly to R2
        await fetch(res.url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        // 3. Store the public URL
        uploadedUrls.push(res.publicUrl);
      }

      onUploadSuccess(uploadedUrls);
      setFiles([]);
    } catch (e) {
      console.error("Upload failed", e);
      alert("Failed to upload some images. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "video/mp4": [],
      "video/quicktime": [],
      "video/webm": [],
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mb-2 h-8 w-8 text-gray-500" />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive
            ? "Drop media here..."
            : "Drag & drop media, or click to select"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supported: JPG, PNG, WEBP, MP4, MOV. Max {maxFiles} files.
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="group relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
              >
                {file.type.startsWith("video/") ? (
                  <video
                    src={file.preview}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    onLoadStart={() => URL.revokeObjectURL(file.preview)}
                  />
                ) : (
                  <img
                    src={file.preview}
                    alt="preview"
                    className="h-full w-full object-cover"
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file.name)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Files to Server"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
