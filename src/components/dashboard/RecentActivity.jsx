import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Syringe, Stethoscope } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ healthRecords, vaccinations, animals }) {
  const getAnimalName = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    return animal?.name || "Unknown";
  };

  // Combine and sort all activities
  const activities = [
    ...healthRecords.map(r => ({
      id: r.id,
      type: 'health',
      date: r.date,
      title: r.type,
      animal: getAnimalName(r.animal_id),
      description: r.description
    })),
    ...vaccinations.map(v => ({
      id: v.id,
      type: 'vaccination',
      date: v.date_given,
      title: v.vaccine_name,
      animal: getAnimalName(v.animal_id),
      description: `Vaccination administered`
    }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-emerald-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'vaccination' 
                    ? 'bg-blue-100' 
                    : 'bg-emerald-100'
                }`}>
                  {activity.type === 'vaccination' ? (
                    <Syringe className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800 capitalize">{activity.title.replace(/_/g, ' ')}</p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(activity.date), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.animal}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}