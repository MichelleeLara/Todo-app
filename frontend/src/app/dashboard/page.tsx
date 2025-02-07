"use client";

import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/app/context/AuthContext";
import { TaskContext } from "@/app/context/TaskContext";

export default function Dashboard() {
  const auth = useContext(AuthContext);
  // Extraemos las funciones necesarias (incluye addSubtask y addComment)
  const { tasks, fetchTasks, createTask, updateTask, addSubtask, addComment, deleteSubtask, updateSubtask, updateComment, deleteComment } = useContext(TaskContext)!;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    if (auth?.user) {
      fetchTasks();
    }
  }, [auth?.user]);

  if (!auth) {
    return <p className="text-center text-red-500">Cargando...</p>;
  }

  const { user, logout } = auth;

  const handleCreateTask = async () => {
    if (newTaskTitle.trim() !== "") {
      await createTask(newTaskTitle);
      setNewTaskTitle("");
      setIsModalOpen(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">
            Hola, <span>{user?.name} : ToDo</span>
          </h1>
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded-lg text-white">
            Cerrar Sesión
          </button>
        </div>

        {/* UI para Nueva Tarea */}
        <article className="flex flex-col gap-2 bg-[#1a1a1a] p-5 rounded-3xl">
          <h2 className="text-2xl">Gestiona tu día</h2>
          <p className="text-[#555555] text-sm">Organiza tus tareas y mantén un seguimiento.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center py-3 mt-3 gap-3 w-fit bg-[#2d2d2d] px-6 rounded-xl text-sm text-[#b7b7b7]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={22}
              height={22}
              color={"#b7b7b7"}
              fill={"none"}
            >
              <path
                d="M12 4V20M20 12H4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Agregar nueva tarea
          </button>
        </article>

        {/* Lista de tareas */}
        <section>
          <h2 className="mb-2">Lista de tareas</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No hay tareas disponibles.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <TaskColumn
                title="Pendiente"
                tasks={tasks.filter((task) => task.status === "pending")}
                onEdit={(t: any) => {
                  setSelectedTask(t);
                  setIsEditModalOpen(true);
                }}
              />
              <TaskColumn
                title="Completado"
                tasks={tasks.filter((task) => task.status === "completed")}
                onEdit={(t: any) => {
                  setSelectedTask(t);
                  setIsEditModalOpen(true);
                }}
              />
            </div>
          )}
        </section>
      </div>

      {/* Modal para agregar tarea */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] p-6 rounded-t-3xl z-50 flex flex-col gap-4 shadow-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
              <h2 className="text-white text-lg font-semibold">Nueva tarea</h2>
              <input
                type="text"
                placeholder="Escribe el título de la tarea..."
                className="w-full p-3 rounded-xl bg-[#2d2d2d] text-white placeholder:text-[#888]"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                className="w-full py-3 bg-white text-black rounded-xl font-medium"
                onClick={handleCreateTask}
              >
                Agregar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal para editar tarea (se muestra cuando isEditModalOpen es true) */}
      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        updateTask={updateTask}
        addSubtask={addSubtask}
        addComment={addComment}
        deleteSubtask={deleteSubtask}
        updateSubtask={updateSubtask}
        updateComment={updateComment}
        deleteComment={deleteComment} 
      />
    </section>
  );
}

/**
 * Componente para mostrar una columna de tareas.
 */
function TaskColumn({ title, tasks, onEdit }: { title: string; tasks: any[]; onEdit: (task: any) => void; }) {
  return (
    <div>
      <div className="flex items-center py-2 justify-between bg-[#1a1a1a] px-4 rounded-3xl text-sm text-[#848484]">
        <p>{title}</p>
      </div>
      <div className="space-y-3 mt-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">Sin tareas en esta categoría.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Componente para mostrar una tarea individual.
 */
function TaskCard({ task, onEdit }: { task: any; onEdit: (task: any) => void; }) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-4 flex flex-col gap-3 relative">
        {/* Estado de la tarea */}
        <div
          className={`px-3 py-1 text-xs rounded-full w-fit ${
            task.status === "pending" ? "bg-[#36290e] text-[#b39558]" : "bg-green-600 text-white"
          }`}
        >
          {task.status}
        </div>
        {/* Título de la tarea */}
        <h3>{task.title}</h3>
        
        {/* Renderizado de Subtareas */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-400">Subtareas:</p>
            <ul className="list-disc ml-4">
              {task.subtasks.map((subtask: any) => (
                <li key={subtask._id} className="text-xs">
                  {subtask.title} ({subtask.status})
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Renderizado de Comentarios */}
        {task.comments && task.comments.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-400">Comentarios:</p>
            <ul className="list-disc ml-4">
              {task.comments.map((comment: any) => (
                <li key={comment._id} className="text-xs">
                  {comment.text}
                </li>
              ))}
            </ul>
          </div>
        )}
        
            {/* Botón para editar la tarea */}
            <div
                className="p-1 bg-[#2a2a2a] w-fit absolute top-4 right-4 rounded-full cursor-pointer"
                onClick={() => onEdit(task)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color={"currentColor"} fill={"none"}>
                    <path d="M11.992 12H12.001" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.9842 18H11.9932" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.9998 6H12.0088" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
  }
  

  

/**
 * Modal para editar tarea que permite:
 * - Actualizar el título y el estado.
 * - Agregar nuevas subtareas (varias, con opción a eliminarlas).
 * - Agregar un nuevo comentario (máximo 1).
 *
 * Este modal se muestra cuando la prop isOpen es true. Se controla la visibilidad
 * mediante el estado interno isVisible, que se reinicializa cada vez que isOpen cambia.
 */
interface EditableSubtask {
    id: string; 
    title: string;
    status: "pending" | "completed";
    isNew?: boolean;
  }
  
  interface EditTaskModalProps {
    task: any;
    isOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    updateTask: (taskId: string, title: string, status: "pending" | "completed") => Promise<any>;
    addSubtask: (taskId: string, title: string, status?: "pending" | "completed") => Promise<any>;
    updateSubtask: (taskId: string, subtaskId: string, data: { title?: string; status?: "pending" | "completed" }) => Promise<any>;
    deleteSubtask: (taskId: string, subtaskId: string) => Promise<any>;
    addComment: (taskId: string, text: string) => Promise<any>;
    updateComment: (taskId: string, commentId: string, text: string) => Promise<any>;
    deleteComment: (taskId: string, commentId: string) => Promise<any>;
  }
  
  function EditTaskModal({
    task,
    isOpen,
    setIsEditModalOpen,
    updateTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    addComment,
    updateComment,
    deleteComment
  }: EditTaskModalProps) {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<"pending" | "completed">("pending");
    const [editableSubtasks, setEditableSubtasks] = useState<EditableSubtask[]>([]);
    const [originalSubtasks, setOriginalSubtasks] = useState<EditableSubtask[]>([]);
    const [newSubtaskInput, setNewSubtaskInput] = useState("");
    const [editableComment, setEditableComment] = useState("");
  
    // Al abrir el modal y si existe la tarea, precargamos sus datos:
    useEffect(() => {
      if (task && isOpen) {
        setTitle(task.title);
        setStatus(task.status);
        // Convertimos las subtareas existentes al formato editable, incluyendo su status
        const subs: EditableSubtask[] = (task.subtasks || []).map((sub: any) => ({
          id: sub._id,
          title: sub.title,
          status: sub.status, // se precarga el status actual
          isNew: false,
        }));
        setEditableSubtasks(subs);
        setOriginalSubtasks(subs);
        // Pre-cargamos el comentario existente (se asume que hay como máximo uno)
        if (task.comments && task.comments.length > 0) {
          setEditableComment(task.comments[0].text);
        } else {
          setEditableComment("");
        }
        // Limpiamos el input para nuevas subtareas
        setNewSubtaskInput("");
      }
    }, [task, isOpen]);
  
    if (!task || !isOpen) return null;
  
    // Handler para editar el título de una subtarea existente
    const handleEditSubtask = (id: string, newTitle: string) => {
      setEditableSubtasks(
        editableSubtasks.map(sub => (sub.id === id ? { ...sub, title: newTitle } : sub))
      );
    };
  
    // Handler para cambiar el status de una subtarea
    const handleChangeSubtaskStatus = (id: string, newStatus: "pending" | "completed") => {
      setEditableSubtasks(
        editableSubtasks.map(sub => (sub.id === id ? { ...sub, status: newStatus } : sub))
      );
    };
  
    // Handler para eliminar una subtarea del arreglo editable
    const handleRemoveSubtask = (id: string) => {
      setEditableSubtasks(editableSubtasks.filter(sub => sub.id !== id));
    };
  
    // Handler para agregar una nueva subtarea al arreglo editable (con status "pending" por defecto)
    const handleAddNewSubtask = () => {
      if (newSubtaskInput.trim() !== "") {
        const newSub: EditableSubtask = {
          id: `new-${Date.now()}`, // id temporal
          title: newSubtaskInput.trim(),
          status: "pending",
          isNew: true,
        };
        setEditableSubtasks([...editableSubtasks, newSub]);
        setNewSubtaskInput("");
      }
    };
  
    // Handler para guardar todos los cambios
    const handleSave = async () => {
      // Validación: si se quiere marcar la tarea como completada,
      // se verifica que no haya subtareas pendientes (las existentes ya tienen su status en task, y nuevas se asumen pendientes)
      if (
        status === "completed" &&
        ((task.subtasks && task.subtasks.some((st: any) => st.status === "pending")) ||
          editableSubtasks.some(sub => sub.isNew || sub.status === "pending"))
      ) {
        alert("Debes completar todas las subtareas antes de marcar la tarea como completada.");
        return;
      }
      try {
        // Actualizamos la tarea principal
        await updateTask(task._id, title, status);
  
        // Procesamos las subtareas:
        // - Para cada subtarea en editableSubtasks:
        //    - Si es nueva, se agrega con su título y status.
        //    - Si es existente y su título o status cambiaron, se actualiza.
        for (const sub of editableSubtasks) {
          if (sub.isNew) {
            await addSubtask(task._id, sub.title, sub.status);
          } else {
            const original = originalSubtasks.find(os => os.id === sub.id);
            if (original && (original.title !== sub.title || original.status !== sub.status)) {
              await updateSubtask(task._id, sub.id, { title: sub.title, status: sub.status });
            }
          }
        }
        // Para cada subtarea original que ya no esté en editableSubtasks, se elimina.
        for (const orig of originalSubtasks) {
          if (!editableSubtasks.find(sub => sub.id === orig.id)) {
            await deleteSubtask(task._id, orig.id);
          }
        }
  
        // Procesamos el comentario:
        if (editableComment.trim() !== "") {
          if (task.comments && task.comments.length > 0) {
            // Si ya existe un comentario y el texto cambió, lo actualizamos
            if (task.comments[0].text !== editableComment.trim()) {
              await updateComment(task._id, task.comments[0]._id, editableComment.trim());
            }
          } else {
            // Si no existe, lo agregamos
            await addComment(task._id, editableComment.trim());
          }
        } else {
          // Si el campo quedó vacío y ya existía un comentario, lo eliminamos
          if (task.comments && task.comments.length > 0) {
            await deleteComment(task._id, task.comments[0]._id);
            setEditableComment("");
          }
        }
  
        // Cerramos el modal
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    };
  
    return (
      <AnimatePresence>
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsEditModalOpen(false)}
        />
        {/* Modal */}
        <motion.div
          key="modal"
          className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] mx-auto w-3/4 p-6 rounded-t-3xl z-50 flex flex-col gap-4 shadow-lg"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-lg font-semibold">Editar tarea</h2>
          {/* Campo para editar el título */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la tarea"
            className="w-full p-3 rounded-xl bg-[#2d2d2d] text-white placeholder:text-[#888]"
          />
          {/* Selector para el estado de la tarea */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "pending" | "completed")}
            className="w-full p-3 rounded-xl bg-[#2d2d2d] text-white"
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
          </select>
    
          {/* Sección de subtareas: mostrar, editar y agregar nuevas */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">Subtareas</label>
            <div className="space-y-2">
              {editableSubtasks.length === 0 ? (
                <p className="text-gray-400 text-xs">No hay subtareas.</p>
              ) : (
                editableSubtasks.map((sub) => (
                  <div key={sub.id} className="flex gap-2">
                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => handleEditSubtask(sub.id, e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-[#2d2d2d] text-white"
                    />
                    <select
                      value={sub.status}
                      onChange={(e) =>
                        handleChangeSubtaskStatus(sub.id, e.target.value as "pending" | "completed")
                      }
                      className="p-2 rounded-xl bg-[#2d2d2d] text-white"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completada</option>
                    </select>
                    <button
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      x
                    </button>
                  </div>
                ))
              )}
            </div>
            {/* Input para agregar nueva subtarea */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                placeholder="Nueva subtarea"
                className="flex-1 p-2 rounded-xl bg-[#2d2d2d] text-white"
              />
              <button
                onClick={handleAddNewSubtask}
                className="px-3 py-2 bg-blue-500 text-white rounded-xl"
              >
                +
              </button>
            </div>
          </div>
    
          {/* Sección para el comentario: cargar en el input para editar o borrar */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm">Comentario</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editableComment}
                onChange={(e) => setEditableComment(e.target.value)}
                placeholder="Comentario"
                className="flex-1 p-2 rounded-xl bg-[#2d2d2d] text-white"
              />
              {editableComment && (
                <button
                  onClick={() => setEditableComment("")}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  x
                </button>
              )}
            </div>
          </div>
    
          {/* Botón para guardar cambios */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-500 text-white rounded-xl font-medium"
          >
            Guardar
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }