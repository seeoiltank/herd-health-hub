import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

const recordTypes = [
  { value: "checkup", label: "🩺 Routine Checkup" },
  { value: "illness", label: "🤒 Illness" },
  { value: "injury", label: "🩹 Injury" },
  { value: "treatment", label: "💊 Treatment" },
  { value: "surgery", label: "🏥 Surgery" },
  { value: "observation", label: "👁️ Observation" }
];

export default function HealthRecordForm({ open, onClose, animalId, record, onSave }) {
  const [formData, setFormData] = useState(record || {
    animal_id: animalId,
    date: new Date().toISOString().split('T')[0],
    type: "",
    description: "",
    weight: "",
    temperature: "",
    symptoms: "",
    treatment: "",
    medication: "",
    vet_name: "",
    follow_up_date: "",
    cost: ""
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      cost: formData.cost ? parseFloat(formData.cost) : null
    };
    
    if (record?.id) {
      await base44.entities.HealthRecord.update(record.id, dataToSave);
    } else {
      await base44.entities.HealthRecord.create(dataToSave);
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
            {record ? "Edit Health Record" : "Add Health Record"} 🩺
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="Current weight"
              />
            </div>

            <div className="space-y-2">
              <Label>Temperature (°F)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                placeholder="e.g., 101.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the health event..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Symptoms</Label>
            <Textarea
              value={formData.symptoms}
              onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
              placeholder="Any symptoms observed..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Treatment</Label>
              <Input
                value={formData.treatment}
                onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
                placeholder="Treatment administered"
              />
            </div>

            <div className="space-y-2">
              <Label>Medication</Label>
              <Input
                value={formData.medication}
                onChange={(e) => setFormData(prev => ({ ...prev, medication: e.target.value }))}
                placeholder="Medication given"
              />
            </div>

            <div className="space-y-2">
              <Label>Veterinarian</Label>
              <Input
                value={formData.vet_name}
                onChange={(e) => setFormData(prev => ({ ...prev, vet_name: e.target.value }))}
                placeholder="Vet name"
              />
            </div>

            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={formData.follow_up_date}
                onChange={(e) => setFormData(prev => ({ ...prev, follow_up_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Cost ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="Treatment cost"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {record ? "Save Changes" : "Add Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}