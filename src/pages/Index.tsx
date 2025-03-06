import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import TaskHeader from "@/components/TaskHeader";
import TaskInput from "@/components/TaskInput";
import TaskFilters from "@/components/TaskFilters";
import TaskList from "@/components/TaskList";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";

const Index = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = React.useState("all");
  const [showQRCode, setShowQRCode] = React.useState(false);
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
      "min-h-screen w-full",
      theme === "dark" 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" 
        : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    )}>
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowQRCode(!showQRCode)}
            className="relative"
            title="Show QR code for mobile access"
          >
            <Smartphone className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div>
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
          
          {showQRCode && (
            <aside className="hidden md:block">
              <div className="sticky top-6">
              <img src="\qr-code (1).png" alt="QR Code" className="w-40 h-40 mx-auto border bg-gray-200" />


                <p className="text-sm text-muted-foreground mt-4">
                  Scan this QR code with your mobile device to access the mobile version of this app.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
