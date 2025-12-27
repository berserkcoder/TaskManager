import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/types';
import { useAuth } from './AuthContext';
import { tasksApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, description: string, deadline: string) => Promise<void>;
  updateTask: (id: string, title: string, description: string, deadline: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await tasksApi.getAll();
      const tasksData = response.data.data.map((task: any) => ({
        id: task._id,
        userId: task.user,
        title: task.title,
        description: task.description || '',
        deadline: task.deadline || '',
        completed: task.completed || false,
        createdAt: task.createdAt,
      }));
      setTasks(tasksData);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (title: string, description: string, deadline: string) => {
    if (!user) return;

    try {
      const response = await tasksApi.create(title, description || undefined, deadline || undefined);
      const newTask = response.data.data;

      setTasks((prev) => [
        {
          id: newTask._id,
          userId: newTask.user,
          title: newTask.title,
          description: newTask.description || '',
          deadline: newTask.deadline || '',
          completed: newTask.completed || false,
          createdAt: newTask.createdAt,
        },
        ...prev,
      ]);

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const updateTask = async (id: string, title: string, description: string, deadline: string) => {
    try {
      const response = await tasksApi.update(id, title, description || undefined, deadline || undefined);
      const updatedTask = response.data.data;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title: updatedTask.title,
                description: updatedTask.description || '',
                deadline: updatedTask.deadline || '',
              }
            : task
        )
      );

      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const response = await tasksApi.toggleCompletion(id);
      const updatedTask = response.data.data;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: updatedTask.completed } : task
        )
      );
    } catch (error: any) {
      console.error('Error toggling task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, addTask, updateTask, deleteTask, toggleComplete, refreshTasks: fetchTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
