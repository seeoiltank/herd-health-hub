import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Stethoscope, Search, Filter, DollarSign, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const recordTypeConfig = {
  checkup: { emoji: "🩺", label: "Checkup", color: "bg-blue-100 text-blue-700" },
  illness: { emoji: "🤒", label: "Illness", color: "bg-red-100 text-red-700" },
  injury: { emoji: "🩹", label: "Injury", color: "bg-orange-100 text-orange-700" },
  treatment: { emoji: "💊", label: "Treatment", color: "bg-purple-100 text-purple-700" },
  surgery: { emoji: "🏥", label: "Surgery", color: "bg-rose-100 text-rose-700" },
  observation: { emoji: "👁️", label: "Observation", color: "bg-teal-100 text-teal-700" }
};

export default function HealthRecords() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: animals = [], isLoading: loadingAnimals } = useQuery({
    queryKey: ['animals'],
    queryFn: () => base44.entities.Animal.list()
  });

  const { data: healthRecords = [], isLoading: loadingRecords } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-date')
  });

  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || "Unknown";
  };

  const filteredRecords = healthRecords.filter(record => {
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    const matchesSearch = record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAnimalName(record.animal_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.medication?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalCost = healthRecords.reduce((sum, r) => sum + (r.cost || 0), 0);

  const isLoading = loadingAnimals || loadingRecords;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Health Records
              </h1>
              <p className="text-gray-600 mt-1">Complete health history for all your animals 🩺</p>
            </div>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
              <CardContent className="p-4 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-white/50" />
                <div>
                  <p className="text-emerald-100 text-xs">Total Medical Costs</p>
                  <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by description, animal, or medication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                {Object.entries(recordTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.emoji} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Records List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <Stethoscope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {healthRecords.length === 0 ? "No health records yet" : "No matches found"}
            </h3>
            <p className="text-gray-500">
              {healthRecords.length === 0 
                ? "Add health records from individual animal pages" 
                : "Try adjusting your search or filters"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record, index) => {
              const config = recordTypeConfig[record.type] || recordTypeConfig.observation;
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className={`p-3 rounded-xl ${config.color.replace('text-', 'bg-').replace('-700', '-100')} self-start`}>
                          <span className="text-3xl">{config.emoji}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={config.color}>{config.label}</Badge>
                                <Link 
                                  to={createPageUrl("AnimalDetail") + `?id=${record.animal_id}`}
                                  className="text-sm font-medium text-emerald-600 hover:underline"
                                >
                                  {getAnimalName(record.animal_id)}
                                </Link>
                              </div>
                              <p className="text-gray-700 mt-2">{record.description}</p>
                            </div>
                            
                            <div className="text-sm text-gray-500 flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(record.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-3 text-sm">
                            {record.symptoms && (
                              <span className="text-gray-600">
                                <span className="font-medium">Symptoms:</span> {record.symptoms}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs text-gray-500">
                            {record.medication && <span>💊 {record.medication}</span>}
                            {record.treatment && <span>🩹 {record.treatment}</span>}
                            {record.vet_name && <span>👨‍⚕️ {record.vet_name}</span>}
                            {record.weight && <span>⚖️ {record.weight} lbs</span>}
                            {record.temperature && <span>🌡️ {record.temperature}°F</span>}
                            {record.cost && <span className="text-emerald-600 font-medium">💵 ${record.cost}</span>}
                            {record.follow_up_date && (
                              <span className="text-amber-600">
                                📅 Follow-up: {format(new Date(record.follow_up_date), 'MMM d')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
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