import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/TaskCard';
import TaskDialog from '@/components/TaskDialog';
import { CheckSquare, Plus, LogOut, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">TaskFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, <span className="text-foreground font-medium">{user?.username}</span>
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats & Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold text-primary">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold text-success">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
          <Button onClick={handleAddTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first task
            </p>
            <Button onClick={handleAddTask} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Dialog */}
      <TaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        task={editingTask}
      />
    </div>
  );
}
