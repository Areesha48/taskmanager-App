
import React from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, newText: string) => void;
  filter: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onToggleComplete,
  onEditTask,
  filter,
}) => {
  // Filter tasks based on filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "high" || filter === "medium" || filter === "low") 
      return task.priority === filter;
    return true;
  });

  // Sort tasks: incomplete first, then by priority (high > medium > low)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority for tasks with the same completion status
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
    
    return aPriority - bPriority;
  });

  if (sortedTasks.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center",
        "text-center p-8",
        "border border-dashed rounded-xl",
        "text-muted-foreground animate-fade-in"
      )}>
        <p className="text-lg font-medium mb-2">No tasks found</p>
        <p className="text-sm">
          {filter === "all" 
            ? "Add a new task to get started" 
            : `No ${filter} tasks found`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onToggleComplete={onToggleComplete}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
