"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; 
import { Edit } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditStateModalProps {
    state: {
        _id: string;
        name: string;
        image: string;
        description: string;
    };
}

export default function EditStateModal({ state }: EditStateModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState(state.image);
    const [description, setDescription] = useState(state.description);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    // Update local state when the parent state prop changes (after a refresh)
    useEffect(() => {
        setImage(state.image);
        setDescription(state.description);
    }, [state]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/states/${state._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image, description }),
            });

            if (!res.ok) {
                const errorMsg = await res.text();
                throw new Error(errorMsg || "Failed to update state");
            }

            toast.success("State updated successfully");
            setIsOpen(false);
            router.refresh(); // Refresh page to show new image
        } catch (error: any) {
            toast.error(error.message || "Failed to update state");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div
                    role="button"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-9 px-3 bg-white/90 backdrop-blur hover:bg-white text-heritage-800 cursor-pointer shadow-sm"
                >
                    <Edit className="h-4 w-4 mr-1" /> Edit Image
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-heritage-50">
                <DialogHeader>
                    <DialogTitle className="text-heritage-900">Edit {state.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heritage-700">State Image</label>
                        <ImageUpload value={image} onChange={setImage} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heritage-700">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-heritage-800 text-white">
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
