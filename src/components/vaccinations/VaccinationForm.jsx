import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function VaccinationForm({ open, onClose, animalId, vaccination, onSave }) {
  const [formData, setFormData] = useState(vaccination || {
    animal_id: animalId,
    vaccine_name: "",
    date_given: new Date().toISOString().split('T')[0],
    next_due_date: "",
    batch_number: "",
    administered_by: "",
    dosage: "",
    notes: "",
    status: "completed"
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    if (vaccination?.id) {
      await base44.entities.Vaccination.update(vaccination.id, formData);
    } else {
      await base44.entities.Vaccination.create(formData);
    }
    
    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {vaccination ? "Edit Vaccination" : "Add Vaccination"} 💉
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Vaccine Name *</Label>
            <Input
              value={formData.vaccine_name}
              onChange={(e) => setFormData(prev => ({ ...prev, vaccine_name: e.target.value }))}
              placeholder="e.g., Rabies, Clostridial"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date Given *</Label>
              <Input
                type="date"
                value={formData.date_given}
                onChange={(e) => setFormData(prev => ({ ...prev, date_given: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Next Due Date</Label>
              <Input
                type="date"
                value={formData.next_due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, next_due_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Batch/Lot Number</Label>
              <Input
                value={formData.batch_number}
                onChange={(e) => setFormData(prev => ({ ...prev, batch_number: e.target.value }))}
                placeholder="Vaccine batch #"
              />
            </div>

            <div className="space-y-2">
              <Label>Dosage</Label>
              <Input
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 2ml"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Administered By</Label>
              <Input
                value={formData.administered_by}
                onChange={(e) => setFormData(prev => ({ ...prev, administered_by: e.target.value }))}
                placeholder="Name of person/vet"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                  <SelectItem value="scheduled">📅 Scheduled</SelectItem>
                  <SelectItem value="overdue">⚠️ Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {vaccination ? "Save Changes" : "Add Vaccination"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}