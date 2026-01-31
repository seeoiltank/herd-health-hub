import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Edit2, Trash2, Plus, Calendar, MapPin, 
  Scale, Tag, Syringe, Stethoscope, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import AnimalForm from "@/components/animals/AnimalForm";
import HealthRecordForm from "@/components/health/HealthRecordForm";
import VaccinationForm from "@/components/vaccinations/VaccinationForm";

const speciesEmoji = {
  cow: "🐄", pig: "🐷", chicken: "🐔", goat: "🐐", sheep: "🐑",
  horse: "🐴", duck: "🦆", turkey: "🦃", rabbit: "🐰", other: "🐾"
};

const statusColors = {
  healthy: "bg-emerald-100 text-emerald-700",
  sick: "bg-red-100 text-red-700",
  recovering: "bg-amber-100 text-amber-700",
  quarantine: "bg-purple-100 text-purple-700",
  deceased: "bg-gray-100 text-gray-700"
};

const recordTypeIcons = {
  checkup: "🩺", illness: "🤒", injury: "🩹", 
  treatment: "💊", surgery: "🏥", observation: "👁️"
};

export default function AnimalDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const animalId = urlParams.get("id");

  const [showEditForm, setShowEditForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showVaxForm, setShowVaxForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("health");

  const queryClient = useQueryClient();

  const { data: animal, isLoading: loadingAnimal } = useQuery({
    queryKey: ['animal', animalId],
    queryFn: async () => {
      const animals = await base44.entities.Animal.filter({ id: animalId });
      return animals[0];
    },
    enabled: !!animalId
  });

  const { data: healthRecords = [], isLoading: loadingHealth } = useQuery({
    queryKey: ['healthRecords', animalId],
    queryFn: () => base44.entities.HealthRecord.filter({ animal_id: animalId }, '-date'),
    enabled: !!animalId
  });

  const { data: vaccinations = [], isLoading: loadingVax } = useQuery({
    queryKey: ['vaccinations', animalId],
    queryFn: () => base44.entities.Vaccination.filter({ animal_id: animalId }, '-date_given'),
    enabled: !!animalId
  });

  const handleDelete = async () => {
    await base44.entities.Animal.delete(animalId);
    window.location.href = createPageUrl("Animals");
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
    queryClient.invalidateQueries({ queryKey: ['healthRecords', animalId] });
    queryClient.invalidateQueries({ queryKey: ['vaccinations', animalId] });
  };

  if (loadingAnimal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Animal not found</h2>
          <Link to={createPageUrl("Animals")}>
            <Button className="bg-amber-500 hover:bg-amber-600">Back to Animals</Button>
          </Link>
        </div>
      </div>
    );
  }

  const age = animal.date_of_birth 
    ? Math.floor((new Date() - new Date(animal.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={createPageUrl("Animals")}>
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Animals
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Animal Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative h-56 bg-gradient-to-br from-amber-100 to-orange-100">
                {animal.photo_url ? (
                  <img 
                    src={animal.photo_url} 
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">{speciesEmoji[animal.species]}</span>
                  </div>
                )}
                <Badge className={`absolute top-4 right-4 ${statusColors[animal.status]} text-sm px-3 py-1`}>
                  {animal.status}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-800">{animal.name}</h1>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => setShowEditForm(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 capitalize mb-4">
                  {speciesEmoji[animal.species]} {animal.breed || animal.species}
                </p>

                <div className="space-y-3">
                  {animal.tag_number && (
                    <div className="flex items-center gap-3 text-sm">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Tag: #{animal.tag_number}</span>
                    </div>
                  )}
                  {age !== null && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{age} {age === 1 ? 'year' : 'years'} old</span>
                    </div>
                  )}
                  {animal.weight && (
                    <div className="flex items-center gap-3 text-sm">
                      <Scale className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{animal.weight} lbs</span>
                    </div>
                  )}
                  {animal.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{animal.location}</span>
                    </div>
                  )}
                  {animal.gender && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">{animal.gender === 'male' ? '♂️' : '♀️'}</span>
                      <span className="text-gray-600 capitalize">{animal.gender}</span>
                    </div>
                  )}
                </div>

                {animal.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">{animal.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Records Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="health" className="gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Health Records
                      </TabsTrigger>
                      <TabsTrigger value="vaccinations" className="gap-2">
                        <Syringe className="w-4 h-4" />
                        Vaccinations
                      </TabsTrigger>
                    </TabsList>
                    <Button
                      size="sm"
                      onClick={() => activeTab === "health" ? setShowHealthForm(true) : setShowVaxForm(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="health" className="mt-0">
                    {loadingHealth ? (
                      <div className="space-y-3">
                        {Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-20 rounded-xl" />
                        ))}
                      </div>
                    ) : healthRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <Stethoscope className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No health records yet</p>
                        <Button 
                          variant="link" 
                          onClick={() => setShowHealthForm(true)}
                          className="text-amber-600"
                        >
                          Add the first health record
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        <AnimatePresence>
                          {healthRecords.map((record, index) => (
                            <motion.div
                              key={record.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                  <span className="text-2xl">{recordTypeIcons[record.type]}</span>
                                  <div>
                                    <p className="font-semibold text-gray-800 capitalize">
                                      {record.type.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                                    {record.medication && (
                                      <p className="text-xs text-gray-500 mt-1">💊 {record.medication}</p>
                                    )}
                                    {record.vet_name && (
                                      <p className="text-xs text-gray-500">🩺 {record.vet_name}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(record.date), 'MMM d, yyyy')}
                                  </p>
                                  {record.cost && (
                                    <p className="text-xs text-gray-400">${record.cost}</p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="vaccinations" className="mt-0">
                    {loadingVax ? (
                      <div className="space-y-3">
                        {Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-20 rounded-xl" />
                        ))}
                      </div>
                    ) : vaccinations.length === 0 ? (
                      <div className="text-center py-12">
                        <Syringe className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No vaccinations recorded</p>
                        <Button 
                          variant="link" 
                          onClick={() => setShowVaxForm(true)}
                          className="text-amber-600"
                        >
                          Add the first vaccination
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        <AnimatePresence>
                          {vaccinations.map((vax, index) => {
                            const isOverdue = vax.next_due_date && new Date(vax.next_due_date) < new Date();
                            return (
                              <motion.div
                                key={vax.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-xl transition-colors ${
                                  isOverdue ? 'bg-red-50 hover:bg-red-100' : 'bg-blue-50 hover:bg-blue-100'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-3">
                                    <span className="text-2xl">💉</span>
                                    <div>
                                      <p className="font-semibold text-gray-800">{vax.vaccine_name}</p>
                                      {vax.dosage && (
                                        <p className="text-sm text-gray-600">Dosage: {vax.dosage}</p>
                                      )}
                                      {vax.administered_by && (
                                        <p className="text-xs text-gray-500">By: {vax.administered_by}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      {format(new Date(vax.date_given), 'MMM d, yyyy')}
                                    </p>
                                    {vax.next_due_date && (
                                      <Badge className={isOverdue ? 'bg-red-100 text-red-700 mt-1' : 'bg-blue-100 text-blue-700 mt-1'}>
                                        {isOverdue && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        Next: {format(new Date(vax.next_due_date), 'MMM d')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Forms */}
      <AnimalForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        animal={animal}
        onSave={refreshData}
      />

      <HealthRecordForm
        open={showHealthForm}
        onClose={() => setShowHealthForm(false)}
        animalId={animalId}
        onSave={refreshData}
      />

      <VaccinationForm
        open={showVaxForm}
        onClose={() => setShowVaxForm(false)}
        animalId={animalId}
        onSave={refreshData}
      />

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {animal.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this animal and all associated health records and vaccinations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}