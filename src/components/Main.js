import {
  addDoc,
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Main.css";

const Main = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [tasks, setTasks] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      if (currentTaskId) {
        const taskDoc = doc(db, "tasks", currentTaskId);
        await updateDoc(taskDoc, { title, description, status });
        alert("Task updated successfully!"); 
      } else {
        const task = { title, description, status };
        await addDoc(collection(db, "tasks"), task);
        alert("Task added successfully!"); 
      }
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setCurrentTaskId(null);
      getTasks();
    } catch (error) {
      console.error("Error adding or updating document: ", error);
    } finally {
      setLoading(false); 
    }
  };

  const getTasks = async () => {
    const q = query(collection(db, "tasks"));
    const querySnapshot = await getDocs(q);
    let tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), id: doc.id });
    });
    setTasks(tasks);
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setCurrentTaskId(task.id);
  };

  const handleDelete = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      alert("Task deleted successfully!"); 
      getTasks();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const categorizedTasks = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Completed: tasks.filter((task) => task.status === "Completed"),
  };

  const moveTask = async (task, newStatus) => {
    const taskDoc = doc(db, "tasks", task.id);
    await updateDoc(taskDoc, { status: newStatus });
    getTasks();
  };

  // Droppable container for status categories
  const TaskCategory = ({ status, tasks }) => {
    const [, drop] = useDrop({
      accept: "TASK",
      drop: (draggedTask) => moveTask(draggedTask, status),
    });

    return (
      <div ref={drop} className="task-category">
        <h2>{status}</h2>
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    );
  };

  // Draggable task card
  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: task,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className="task-card"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div className="task-actions">
          <button onClick={() => handleEdit(task)} disabled={loading}>
            Edit
          </button>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <form className="task-form" onSubmit={onSubmit}>
          <div className="form-control">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? currentTaskId
                ? "Updating..."
                : "Submitting..."
              : currentTaskId
              ? "Update"
              : "Submit"}
          </button>
        </form>

        <div className="tasks-container">
          {Object.entries(categorizedTasks).map(([category, tasks]) => (
            <TaskCategory key={category} status={category} tasks={tasks} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Main;
