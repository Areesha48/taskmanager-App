
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import TaskHeader from "@/components/TaskHeader";
import TaskInput from "@/components/TaskInput";
import TaskFilters from "@/components/TaskFilters";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { toast } from "sonner";

const Mobile = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = React.useState("all");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      setMounted(true);
    }
  }, [tasks, mounted]);

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    high: tasks.filter(task => task.priority === "high").length,
    medium: tasks.filter(task => task.priority === "medium").length,
    low: tasks.filter(task => task.priority === "low").length,
  };

  const handleAddTask = (text: string, priority: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast.success("Task added");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  const handleEditTask = (id: string, newText: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, text: newText } 
          : task
      )
    );
    toast.success("Task updated");
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount === 0) return;
    
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    toast.success(`Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`);
  };

  return (
    <div className={cn(
      "min-h-screen w-full pb-16",
      theme === "dark" 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" 
        : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    )}>
      <header className="sticky top-0 z-10 glass px-4 py-3 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to desktop</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="px-4 py-6">
        <TaskHeader 
          totalTasks={tasks.length} 
          completedTasks={tasks.filter(task => task.completed).length}
        />
        
        <div className="mt-6">
          <TaskInput onAddTask={handleAddTask} />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Tasks</h2>
            {tasks.filter(task => task.completed).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCompleted}
                className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear completed
              </Button>
            )}
          </div>

          <TaskFilters 
            activeFilter={filter} 
            onFilterChange={setFilter} 
            taskCounts={taskCounts}
          />

          <TaskList
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
};

export default Mobile;
