import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveSelect } from "@/components/ui/responsive-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { Camera, Loader2, X } from "lucide-react";

const speciesOptions = [
  { value: "cow", label: "🐄 Cow" },
  { value: "pig", label: "🐷 Pig" },
  { value: "chicken", label: "🐔 Chicken" },
  { value: "goat", label: "🐐 Goat" },
  { value: "sheep", label: "🐑 Sheep" },
  { value: "horse", label: "🐴 Horse" },
  { value: "duck", label: "🦆 Duck" },
  { value: "turkey", label: "🦃 Turkey" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "other", label: "🐾 Other" }
];

export default function AnimalForm({ open, onClose, animal, onSave }) {
  const [formData, setFormData] = useState(animal || {
    name: "",
    species: "",
    breed: "",
    tag_number: "",
    date_of_birth: "",
    gender: "",
    weight: "",
    status: "healthy",
    photo_url: "",
    notes: "",
    acquisition_date: "",
    location: ""
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, photo_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : null
    };
    
    if (animal?.id) {
      await base44.entities.Animal.update(animal.id, dataToSave);
    } else {
      await base44.entities.Animal.create(dataToSave);
    }
    
    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {animal ? "Edit Animal" : "Add New Animal"} 🐾
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Photo Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border-2 border-dashed border-amber-300">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Animal" className="w-full h-full object-cover" />
                ) : uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                ) : (
                  <Camera className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {formData.photo_url && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo_url: "" }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Bessie"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Species *</Label>
              <ResponsiveSelect
                value={formData.species}
                onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}
                placeholder="Select species"
                options={speciesOptions}
                label="Species"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Breed</Label>
              <Input
                value={formData.breed}
                onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                placeholder="e.g., Holstein"
              />
            </div>

            <div className="space-y-2">
              <Label>Tag Number</Label>
              <Input
                value={formData.tag_number}
                onChange={(e) => setFormData(prev => ({ ...prev, tag_number: e.target.value }))}
                placeholder="e.g., A-001"
              />
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <ResponsiveSelect
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                placeholder="Select gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" }
                ]}
                label="Gender"
              />
            </div>

            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 1200"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <ResponsiveSelect
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                placeholder="Select status"
                options={[
                  { value: "healthy", label: "✅ Healthy" },
                  { value: "sick", label: "🤒 Sick" },
                  { value: "recovering", label: "💊 Recovering" },
                  { value: "quarantine", label: "🔒 Quarantine" },
                  { value: "deceased", label: "🕊️ Deceased" }
                ]}
                label="Status"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Barn A, Pasture 2"
              />
            </div>

            <div className="space-y-2">
              <Label>Acquisition Date</Label>
              <Input
                type="date"
                value={formData.acquisition_date}
                onChange={(e) => setFormData(prev => ({ ...prev, acquisition_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this animal..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {animal ? "Save Changes" : "Add Animal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}