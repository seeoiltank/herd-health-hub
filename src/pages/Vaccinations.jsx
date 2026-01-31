import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, isPast, differenceInDays, addDays } from "date-fns";
import { motion } from "framer-motion";
import { Syringe, Calendar, AlertTriangle, CheckCircle, Clock, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Vaccinations() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: animals = [], isLoading: loadingAnimals } = useQuery({
    queryKey: ['animals'],
    queryFn: () => base44.entities.Animal.list()
  });

  const { data: vaccinations = [], isLoading: loadingVax } = useQuery({
    queryKey: ['vaccinations'],
    queryFn: () => base44.entities.Vaccination.list('-date_given')
  });

  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || "Unknown";
  };

  const getVaccinationStatus = (vax) => {
    if (!vax.next_due_date) return 'completed';
    const dueDate = new Date(vax.next_due_date);
    if (isPast(dueDate)) return 'overdue';
    if (differenceInDays(dueDate, new Date()) <= 14) return 'upcoming';
    return 'completed';
  };

  const filteredVaccinations = vaccinations.filter(vax => {
    const status = getVaccinationStatus(vax);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesSearch = vax.vaccine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAnimalName(vax.animal_id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const overdueCount = vaccinations.filter(v => getVaccinationStatus(v) === 'overdue').length;
  const upcomingCount = vaccinations.filter(v => getVaccinationStatus(v) === 'upcoming').length;

  const isLoading = loadingAnimals || loadingVax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Vaccinations
              </h1>
              <p className="text-gray-600 mt-1">Track and manage all vaccination records 💉</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-400 to-indigo-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Vaccinations</p>
                    <p className="text-4xl font-bold text-white mt-1">{vaccinations.length}</p>
                  </div>
                  <Syringe className="w-10 h-10 text-white/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Due Soon</p>
                    <p className="text-4xl font-bold text-white mt-1">{upcomingCount}</p>
                  </div>
                  <Clock className="w-10 h-10 text-white/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-400 to-rose-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Overdue</p>
                    <p className="text-4xl font-bold text-white mt-1">{overdueCount}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-white/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by vaccine or animal name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vaccinations</SelectItem>
                <SelectItem value="overdue">⚠️ Overdue</SelectItem>
                <SelectItem value="upcoming">⏰ Due Soon</SelectItem>
                <SelectItem value="completed">✅ Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Vaccinations List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : filteredVaccinations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <Syringe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {vaccinations.length === 0 ? "No vaccinations recorded" : "No matches found"}
            </h3>
            <p className="text-gray-500">
              {vaccinations.length === 0 
                ? "Add vaccination records from individual animal pages" 
                : "Try adjusting your search or filters"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredVaccinations.map((vax, index) => {
              const status = getVaccinationStatus(vax);
              const daysUntilDue = vax.next_due_date 
                ? differenceInDays(new Date(vax.next_due_date), new Date())
                : null;
              
              return (
                <motion.div
                  key={vax.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow ${
                    status === 'overdue' ? 'border-l-4 border-l-red-500' :
                    status === 'upcoming' ? 'border-l-4 border-l-amber-500' :
                    'border-l-4 border-l-green-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            status === 'overdue' ? 'bg-red-100' :
                            status === 'upcoming' ? 'bg-amber-100' :
                            'bg-green-100'
                          }`}>
                            <Syringe className={`w-6 h-6 ${
                              status === 'overdue' ? 'text-red-600' :
                              status === 'upcoming' ? 'text-amber-600' :
                              'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{vax.vaccine_name}</h3>
                            <Link 
                              to={createPageUrl("AnimalDetail") + `?id=${vax.animal_id}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {getAnimalName(vax.animal_id)}
                            </Link>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-sm text-gray-500">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Given: {format(new Date(vax.date_given), 'MMM d, yyyy')}
                          </div>
                          
                          {vax.next_due_date && (
                            <Badge className={`${
                              status === 'overdue' ? 'bg-red-100 text-red-700' :
                              status === 'upcoming' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {status === 'overdue' ? (
                                <><AlertTriangle className="w-3 h-3 mr-1" /> Overdue by {Math.abs(daysUntilDue)} days</>
                              ) : status === 'upcoming' ? (
                                <><Clock className="w-3 h-3 mr-1" /> Due in {daysUntilDue} days</>
                              ) : (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Next: {format(new Date(vax.next_due_date), 'MMM d')}</>
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {(vax.administered_by || vax.dosage || vax.batch_number) && (
                        <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs text-gray-500">
                          {vax.administered_by && <span>👤 {vax.administered_by}</span>}
                          {vax.dosage && <span>💉 {vax.dosage}</span>}
                          {vax.batch_number && <span>📋 Batch: {vax.batch_number}</span>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}