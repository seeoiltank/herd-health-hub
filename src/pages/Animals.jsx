import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Filter, Grid3X3, List, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

import AnimalCard from "@/components/animals/AnimalCard";
import AnimalForm from "@/components/animals/AnimalForm";

export default function Animals() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const { data: animals = [], isLoading } = useQuery({
    queryKey: ['animals'],
    queryFn: () => base44.entities.Animal.list('-created_date')
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['animals'] });
    setTimeout(() => setIsRefreshing(false), 500);
  }, [queryClient]);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.tag_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = speciesFilter === "all" || animal.species === speciesFilter;
    const matchesStatus = statusFilter === "all" || animal.status === statusFilter;
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const speciesCounts = animals.reduce((acc, animal) => {
    acc[animal.species] = (acc[animal.species] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                My Animals
              </h1>
              <p className="text-gray-600 mt-1">Manage and track all your farm animals 🐾</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Animal
              </Button>
            </div>
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
                placeholder="Search by name, tag, or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  <SelectItem value="cow">🐄 Cow ({speciesCounts.cow || 0})</SelectItem>
                  <SelectItem value="pig">🐷 Pig ({speciesCounts.pig || 0})</SelectItem>
                  <SelectItem value="chicken">🐔 Chicken ({speciesCounts.chicken || 0})</SelectItem>
                  <SelectItem value="goat">🐐 Goat ({speciesCounts.goat || 0})</SelectItem>
                  <SelectItem value="sheep">🐑 Sheep ({speciesCounts.sheep || 0})</SelectItem>
                  <SelectItem value="horse">🐴 Horse ({speciesCounts.horse || 0})</SelectItem>
                  <SelectItem value="duck">🦆 Duck ({speciesCounts.duck || 0})</SelectItem>
                  <SelectItem value="turkey">🦃 Turkey ({speciesCounts.turkey || 0})</SelectItem>
                  <SelectItem value="rabbit">🐰 Rabbit ({speciesCounts.rabbit || 0})</SelectItem>
                  <SelectItem value="other">🐾 Other ({speciesCounts.other || 0})</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">✅ Healthy</SelectItem>
                  <SelectItem value="sick">🤒 Sick</SelectItem>
                  <SelectItem value="recovering">💊 Recovering</SelectItem>
                  <SelectItem value="quarantine">🔒 Quarantine</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filteredAnimals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {animals.length === 0 ? "No animals yet" : "No matches found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {animals.length === 0 
                ? "Start by adding your first farm animal" 
                : "Try adjusting your search or filters"}
            </p>
            {animals.length === 0 && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Animal
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }
          >
            <AnimatePresence>
              {filteredAnimals.map((animal, index) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AnimalCard animal={animal} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results count */}
        {!isLoading && filteredAnimals.length > 0 && (
          <p className="text-center text-gray-500 mt-6">
            Showing {filteredAnimals.length} of {animals.length} animals
          </p>
        )}
      </div>

      {/* Add Animal Form */}
      <AnimalForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={() => queryClient.invalidateQueries({ queryKey: ['animals'] })}
      />
    </div>
  );
}