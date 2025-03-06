
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, AlertCircle, Clock, CircleDot } from "lucide-react";

interface TaskFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
    high: number;
    medium: number;
    low: number;
  };
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  onFilterChange,
  taskCounts,
}) => {
  const filters = [
    { id: "all", label: "All", icon: CircleDot, count: taskCounts.all },
    { id: "active", label: "Active", icon: Circle, count: taskCounts.active },
    { id: "completed", label: "Completed", icon: CheckCircle2, count: taskCounts.completed },
    { id: "high", label: "High", icon: AlertCircle, count: taskCounts.high, color: "text-red-500" },
    { id: "medium", label: "Medium", icon: AlertCircle, count: taskCounts.medium, color: "text-amber-500" },
    { id: "low", label: "Low", icon: AlertCircle, count: taskCounts.low, color: "text-green-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "rounded-full flex items-center gap-1.5",
            activeFilter === filter.id 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted/50",
            filter.color && activeFilter !== filter.id && filter.color
          )}
        >
          <filter.icon className={cn(
            "h-3.5 w-3.5", 
            activeFilter === filter.id 
              ? "text-primary-foreground" 
              : filter.color || "text-muted-foreground"
          )} />
          {filter.label}
          {filter.count > 0 && (
            <span className={cn(
              "inline-flex items-center justify-center",
              "ml-0.5 rounded-full text-xs",
              "min-w-5 h-5 px-1",
              activeFilter === filter.id 
                ? "bg-white/20 text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {filter.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default TaskFilters;
