import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/taskController.js";

const router = express.Router();

// Crear una nueva tarea
router.post("/", authMiddleware, createTask);

// Obtener todas las tareas del usuario autenticado
router.get("/", authMiddleware, getUserTasks);

// Actualizar una tarea
router.put("/:taskId", authMiddleware, updateTask);

// Eliminar una tarea
router.delete("/:taskId", authMiddleware, deleteTask);

// 🔹 Rutas para Subtareas
router.post("/:taskId/subtasks", authMiddleware, addSubtask);
router.put("/:taskId/subtasks/:subtaskId", authMiddleware, updateSubtask);
router.delete("/:taskId/subtasks/:subtaskId", authMiddleware, deleteSubtask);

// 🔹 Ruta para Comentarios
router.post("/:taskId/comments", authMiddleware, addComment);
router.put("/:taskId/comments/:commentId", authMiddleware, updateComment);
router.delete("/:taskId/comments/:commentId", authMiddleware, deleteComment);

export default router;
