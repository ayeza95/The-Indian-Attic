"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({
    value,
    onChange,
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ayeza24");

        try {
            // Direct upload to Cloudinary (requires unsigned preset) or via our API
            // For security, usually better to go through our API which handles the signature
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onChange(data.url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-40 h-40 border-2 border-dashed border-heritage-200 rounded-lg flex flex-col items-center justify-center overflow-hidden bg-heritage-50">
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-heritage-500">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="text-xs">Uploading...</span>
                    </div>
                ) : value ? (
                    <>
                        <Image
                            fill
                            src={value}
                            alt="Uploaded image"
                            className="object-cover"
                        />
                        <button
                            onClick={handleRemove}
                            disabled={disabled}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <div
                        className="flex flex-col items-center gap-2 text-heritage-300 w-full h-full justify-center"
                    >
                        <Upload className="h-8 w-8" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
                disabled={disabled || isUploading}
            />

            {!value && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-heritage-600 border-heritage-300"
                >
                    Select Image
                </Button>
            )}
        </div>
    );
}
