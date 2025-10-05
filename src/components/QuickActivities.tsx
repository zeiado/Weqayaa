import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickActivity } from "@/types/dashboard";

interface QuickActivitiesProps {
  activities: QuickActivity[];
  onComplete?: (id: number) => void;
}

export const QuickActivities: React.FC<QuickActivitiesProps> = ({ activities, onComplete }) => {
  return (
    <div className="grid gap-4 sm:gap-6">
      {activities.map((activity) => (
        <Card key={activity.id} className="glass-card p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl">
              {activity.icon || '⚡'}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{activity.title}</h4>
              <p className="text-sm text-foreground/70">{activity.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activity.duration ? (
              <span className="text-xs text-foreground/70">{activity.duration} دقيقة</span>
            ) : null}
            <Button
              size="sm"
              variant={activity.isCompleted ? "outline" : "default"}
              disabled={activity.isCompleted}
              onClick={() => onComplete?.(activity.id)}
            >
              {activity.isCompleted ? 'مكتملة' : 'إنهاء'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};


