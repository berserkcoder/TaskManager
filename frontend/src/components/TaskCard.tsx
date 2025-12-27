import { Task } from '@/types';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleComplete, deleteTask } = useTasks();

  const formattedDeadline = task.deadline 
    ? format(new Date(task.deadline), 'MMM d, yyyy')
    : null;

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;

  return (
    <Card className={`group transition-all duration-200 hover:shadow-md border-border ${
      task.completed ? 'bg-muted/50' : 'bg-card'
    } animate-fade-in`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleComplete(task.id)}
            className="mt-1 h-5 w-5 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-foreground leading-snug ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-1 text-sm leading-relaxed ${
                task.completed ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'
              }`}>
                {task.description}
              </p>
            )}
            
            {formattedDeadline && (
              <div className={`flex items-center gap-1.5 mt-2 text-xs ${
                task.completed 
                  ? 'text-muted-foreground/70' 
                  : isOverdue 
                    ? 'text-destructive' 
                    : 'text-muted-foreground'
              }`}>
                <Calendar className="h-3.5 w-3.5" />
                <span className={task.completed ? 'line-through' : ''}>
                  {isOverdue && !task.completed ? 'Overdue: ' : ''}{formattedDeadline}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
