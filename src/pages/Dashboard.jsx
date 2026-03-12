import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PawPrint, Heart, Syringe, AlertCircle, Plus, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingVaccinations from "@/components/dashboard/UpcomingVaccinations";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AnimalCard from "@/components/animals/AnimalCard";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: animals = [], isLoading: loadingAnimals } = useQuery({
    queryKey: ['animals'],
    queryFn: () => base44.entities.Animal.list('-created_date')
  });

  const { data: healthRecords = [], isLoading: loadingHealth } = useQuery({
    queryKey: ['healthRecords'],
    queryFn: () => base44.entities.HealthRecord.list('-date', 50)
  });

  const { data: vaccinations = [], isLoading: loadingVax } = useQuery({
    queryKey: ['vaccinations'],
    queryFn: () => base44.entities.Vaccination.list('-date_given', 50)
  });

  const isLoading = loadingAnimals || loadingHealth || loadingVax;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['animals'] }),
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] }),
      queryClient.invalidateQueries({ queryKey: ['vaccinations'] })
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  }, [queryClient]);

  const healthyCount = animals.filter(a => a.status === 'healthy').length;
  const sickCount = animals.filter(a => ['sick', 'recovering', 'quarantine'].includes(a.status)).length;

  const stats = [
    { title: "Total Animals", value: animals.length, icon: PawPrint, gradient: "bg-gradient-to-br from-amber-400 to-orange-500" },
    { title: "Healthy", value: healthyCount, icon: Heart, gradient: "bg-gradient-to-br from-emerald-400 to-teal-500" },
    { title: "Vaccinations", value: vaccinations.length, icon: Syringe, gradient: "bg-gradient-to-br from-blue-400 to-indigo-500" },
    { title: "Need Attention", value: sickCount, icon: AlertCircle, gradient: "bg-gradient-to-br from-rose-400 to-pink-500" }
  ];

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
                Critter Log
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's how your animals are doing 🌾</p>
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
              <Link to={createPageUrl("Animals")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Animal
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))
          ) : (
            stats.map((stat, index) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                gradient={stat.gradient}
                delay={index * 0.1}
              />
            ))
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RecentActivity 
              healthRecords={healthRecords} 
              vaccinations={vaccinations} 
              animals={animals} 
            />
          </div>
          <div>
            <UpcomingVaccinations 
              vaccinations={vaccinations} 
              animals={animals} 
            />
          </div>
        </div>

        {/* Recent Animals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Animals</h2>
            <Link to={createPageUrl("Animals")}>
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🐄</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No animals yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first farm animal</p>
              <Link to={createPageUrl("Animals")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Animal
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {animals.slice(0, 8).map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}