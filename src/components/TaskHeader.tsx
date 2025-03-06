
import React from "react";
import { cn } from "@/lib/utils";
import { CheckSquare, Sparkles } from "lucide-react";

interface TaskHeaderProps {
  totalTasks: number;
  completedTasks: number;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ totalTasks, completedTasks }) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <CheckSquare className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
          Task Manager
        </h1>
        
        {progress === 100 && totalTasks > 0 && (
          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full animate-pulse">
            <Sparkles className="h-3 w-3" />
            <span>All done!</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-muted-foreground font-medium">
          {totalTasks === 0 ? (
            "Add your first task to get started"
          ) : (
            <>
              Completed <span className="font-bold text-foreground">{completedTasks}</span> of{" "}
              <span className="font-bold text-foreground">{totalTasks}</span> tasks
            </>
          )}
        </p>
        
        <div className="w-full sm:w-52 bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-in-out shadow-sm",
              progress === 100 
                ? "bg-gradient-to-r from-green-400 to-green-500" 
                : "bg-gradient-to-r from-blue-400 to-violet-500"
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
