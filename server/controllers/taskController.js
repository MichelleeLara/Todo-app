import Task from "../models/Task.js";


// Create a new task
export const createTask = async (req, res) => {
    const { title } = req.body;
    console.log(req)
    if (!title) {
        return res.status(400).json({ message: "Task title is required" });
    }

    try {
        const newTask = new Task({
            title,
            userId: req.userId
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

// get all task
export const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, status } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: req.userId },
            { title, status },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, userId: req.userId });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

// Add subtask
export const addSubtask = async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Subtask title is required" });
    }

    try {
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });


        // 🔹 Agregar la subtarea a la lista
        task.subtasks.push({ title });

        // 🔹 Verificar si todas las subtareas están completadas
        task.status = "pending";

        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error adding subtask", error: error.message });
    }
};

// Change subtaks status
export const updateSubtask = async (req, res) => {
    const { taskId, subtaskId } = req.params;
    // Ahora se esperan ambas propiedades, status y title, en el body
    const { status, title } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ message: "Subtask not found" });

        // Actualizamos las propiedades si vienen en el body
        if (status !== undefined) {
            subtask.status = status;
        }
        if (title !== undefined) {
            subtask.title = title;
        }

        await task.save();

        // Verificamos si quedan subtareas pendientes para actualizar el estado de la tarea principal
        const hasPendingSubtasks = task.subtasks.some(st => st.status === "pending");
        task.status = hasPendingSubtasks ? "pending" : "completed";

        await task.save(); // Guardamos nuevamente los cambios en la BD

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating subtask", error: error.message });
    }
};


export const deleteSubtask = async (req, res) => {
    const { taskId, subtaskId } = req.params;

    try {
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });


        task.subtasks = task.subtasks.filter(st => st._id.toString() !== subtaskId);


        const allCompleted = task.subtasks.every(st => st.status === "completed");
        task.status = allCompleted ? "completed" : "pending";

        await task.save();

        res.status(200).json({ message: "Subtask deleted successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error deleting subtask", error: error.message });
    }
};



// Add coment
export const addComment = async (req, res) => {
    const { taskId } = req.params;
    const { text } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });


        task.comments.push({ text });
        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

export const updateComment = async (req, res) => {
    const { taskId, commentId } = req.params;
    const { text } = req.body;
    try {
      const task = await Task.findOne({ _id: taskId, userId: req.userId });
      if (!task)
        return res.status(404).json({ message: "Task not found or unauthorized" });
      
      const comment = task.comments.id(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      
      comment.text = text;
      await task.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error updating comment", error: error.message });
    }
  };
  
  export const deleteComment = async (req, res) => {
    const { taskId, commentId } = req.params;
    try {
      const task = await Task.findOne({ _id: taskId, userId: req.userId });
      if (!task)
        return res.status(404).json({ message: "Task not found or unauthorized" });
      
      // Remover el comentario usando pull()
      task.comments.pull(commentId);
      
      await task.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
  };
  
  
  