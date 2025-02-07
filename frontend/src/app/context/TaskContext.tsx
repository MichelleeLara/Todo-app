"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import API from "@/app/api/api";

interface Task {
  _id: string;
  title: string;
  status: "pending" | "completed";
  subtasks?: any[];
  comments?: any[];
}

interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  updateTask: (taskId: string, title: string, status: "pending" | "completed") => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, data: { title?: string; status?: "pending" | "completed" }) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  updateComment: (taskId: string, commentId: string, text: string) => Promise<void>;
  deleteComment: (taskId: string, commentId: string) => Promise<void>;
}


export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async (): Promise<void> => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };
  
  const createTask = async (title: string): Promise<void> => {
    try {
      await API.post("/tasks", { title });
      fetchTasks();
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };
  
  const updateTask = async (taskId: string, title: string, status: "pending" | "completed"): Promise<void> => {
    try {
      await API.put(`/tasks/${taskId}`, { title, status });
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };
  
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };
  
  const addSubtask = async (taskId: string, title: string): Promise<void> => {
    try {
      await API.post(`/tasks/${taskId}/subtasks`, { title });
      fetchTasks();
    } catch (error) {
      console.error("Error al agregar subtarea:", error);
    }
  };
  
  const updateSubtask = async (
    taskId: string,
    subtaskId: string,
    data: { title?: string; status?: "pending" | "completed" }
  ): Promise<void> => {
    try {
      await API.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar subtarea:", error);
    }
  };
  
  const deleteSubtask = async (taskId: string, subtaskId: string): Promise<void> => {
    try {
      await API.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar subtarea:", error);
    }
  };
  
  const addComment = async (taskId: string, text: string): Promise<void> => {
    try {
      await API.post(`/tasks/${taskId}/comments`, { text });
      fetchTasks();
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };
  
  const updateComment = async (taskId: string, commentId: string, text: string): Promise<void> => {
    try {
      await API.put(`/tasks/${taskId}/comments/${commentId}`, { text });
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
    }
  };
  
  const deleteComment = async (taskId: string, commentId: string): Promise<void> => {
    try {
      await API.delete(`/tasks/${taskId}/comments/${commentId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };
  
  

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        addComment,
        updateComment,
        deleteComment
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
