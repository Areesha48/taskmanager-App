
import React, { useState, useRef, useEffect } from "react";
import { Check, Trash2, Edit, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (editedText.trim() !== "" && editedText !== task.text) {
      onEdit(task.id, editedText);
    } else {
      setEditedText(task.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditedText(task.text);
      setIsEditing(false);
    }
  };

  const priorityClasses = {
    high: "border-red-200 bg-red-50/40",
    medium: "border-amber-200 bg-amber-50/40",
    low: "border-green-200 bg-green-50/40",
  };

  const priorityIconClasses = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-green-500",
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 md:p-4",
        "border rounded-xl transition-all duration-300",
        "animate-scale-in hover:shadow-sm",
        task.completed ? "bg-muted/20" : priorityClasses[task.priority as keyof typeof priorityClasses]
      )}
    >
      <Button
        onClick={() => onToggleComplete(task.id)}
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full w-6 h-6 p-0 flex-shrink-0",
          "border transition-all duration-300",
          task.completed 
            ? "bg-success/20 text-success border-success/30" 
            : "bg-background/50 text-muted-foreground hover:text-primary"
        )}
      >
        <Check className={cn("h-3 w-3", task.completed && "text-success")} />
        <span className="sr-only">
          {task.completed ? "Mark as incomplete" : "Mark as complete"}
        </span>
      </Button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEdit}
            className="w-full bg-background/50 border rounded-md p-2 text-foreground"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium inline-block px-2 py-0.5 rounded-full",
                "text-xs uppercase tracking-wider",
                priorityIconClasses[task.priority as keyof typeof priorityIconClasses]
              )}
            >
              {task.priority}
            </span>
            <p
              className={cn(
                "text-base font-medium text-balance",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.text}
            </p>
          </div>
        )}
      </div>

      <div className={cn(
        "flex items-center gap-1", 
        "opacity-0 group-hover:opacity-100",
        "transition-opacity duration-200"
      )}>
        {isEditing ? (
          <>
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
            >
              <Save className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
            <Button
              onClick={() => {
                setEditedText(task.text);
                setIsEditing(false);
              }}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              disabled={task.completed}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              onClick={() => onDelete(task.id)}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
