import React, { useState, useRef, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TaskInputProps {
  onAddTask: (task: string, priority: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task.trim(), priority);
      setTask("");
      // Keep focus on input after submission
      inputRef.current?.focus();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "w-full transition-all duration-300 ease-out",
        "glass border rounded-xl p-3 md:p-4",
        "shadow-sm hover:shadow-md",
        isFocused && "ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a new task... (Ctrl+N)"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full bg-transparent p-2",
              "text-foreground placeholder:text-muted-foreground",
              "border-0 outline-none focus:ring-0",
              "text-base md:text-lg font-medium"
            )}
          />
        </div>
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={cn(
            "bg-transparent border rounded-lg",
            "px-2 py-1 text-sm font-medium",
            "focus:ring-1 focus:ring-primary/30",
            priority === "high" && "text-red-500 border-red-200",
            priority === "medium" && "text-amber-500 border-amber-200",
            priority === "low" && "text-green-500 border-green-200"
          )}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <Button 
          type="submit" 
          size="sm" 
          disabled={!task.trim()}
          className={cn(
            "rounded-full w-10 h-10 p-0",
            "bg-primary/10 hover:bg-primary/20 text-primary",
            "transition-all duration-200",
            !task.trim() && "opacity-50 cursor-not-allowed"
          )}
        >
          <PlusCircle className="h-5 w-5" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;
