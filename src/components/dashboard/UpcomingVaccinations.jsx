import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";

export default function UpcomingVaccinations({ vaccinations, animals }) {
  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || "Unknown";
  };

  const upcomingVaccinations = vaccinations
    .filter(v => v.next_due_date)
    .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-blue-500" />
          Upcoming Vaccinations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingVaccinations.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No upcoming vaccinations</p>
        ) : (
          <div className="space-y-3">
            {upcomingVaccinations.map((vax) => {
              const isOverdue = isPast(new Date(vax.next_due_date));
              const daysUntil = differenceInDays(new Date(vax.next_due_date), new Date());
              
              return (
                <div
                  key={vax.id}
                  className={`p-3 rounded-xl border ${
                    isOverdue 
                      ? 'bg-red-50 border-red-200' 
                      : daysUntil <= 7 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{vax.vaccine_name}</p>
                      <p className="text-sm text-gray-600">{getAnimalName(vax.animal_id)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        isOverdue 
                          ? 'bg-red-100 text-red-700' 
                          : daysUntil <= 7 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-100 text-blue-700'
                      }>
                        {isOverdue ? (
                          <><AlertTriangle className="w-3 h-3 mr-1" /> Overdue</>
                        ) : daysUntil === 0 ? (
                          'Due Today'
                        ) : (
                          `${daysUntil} days`
                        )}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(vax.next_due_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}