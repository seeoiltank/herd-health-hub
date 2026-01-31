import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const speciesEmoji = {
  cow: "🐄",
  pig: "🐷",
  chicken: "🐔",
  goat: "🐐",
  sheep: "🐑",
  horse: "🐴",
  duck: "🦆",
  turkey: "🦃",
  rabbit: "🐰",
  other: "🐾"
};

const statusColors = {
  healthy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  sick: "bg-red-100 text-red-700 border-red-200",
  recovering: "bg-amber-100 text-amber-700 border-amber-200",
  quarantine: "bg-purple-100 text-purple-700 border-purple-200",
  deceased: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function AnimalCard({ animal }) {
  const age = animal.date_of_birth 
    ? Math.floor((new Date() - new Date(animal.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <Link to={createPageUrl("AnimalDetail") + `?id=${animal.id}`}>
      <Card className="group overflow-hidden bg-white hover:shadow-xl transition-all duration-500 cursor-pointer border-0 shadow-md hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
          {animal.photo_url ? (
            <img 
              src={animal.photo_url} 
              alt={animal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                {speciesEmoji[animal.species] || "🐾"}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge className={`${statusColors[animal.status]} border font-medium px-3 py-1`}>
              {animal.status}
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-bold text-xl">{animal.name}</h3>
            <p className="text-white/80 text-sm capitalize">{animal.breed || animal.species}</p>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">{speciesEmoji[animal.species]}</span>
              <span className="capitalize">{animal.species}</span>
            </div>
            {animal.tag_number && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-mono">
                #{animal.tag_number}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {age !== null && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{age} {age === 1 ? 'year' : 'years'} old</span>
              </div>
            )}
            {animal.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{animal.location}</span>
              </div>
            )}
          </div>
          
          {animal.weight && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Weight: </span>
              <span className="text-sm font-semibold text-gray-700">{animal.weight} lbs</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}