"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Create Form State
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});

  const fetchTasks = useCallback(async () => {
    try {
      // Build query string dynamically based on active filters
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterPriority) params.append("priority", filterPriority);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortBy) params.append("sortOrder", sortOrder);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error: any) {
      console.error("Failed to fetch tasks", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, sortBy, sortOrder, router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTasks();
  }, [fetchTasks, router]);

  // --- Handlers ---

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        title,
        dueDate: new Date(dueDate).toISOString(),
      });
      setTitle("");
      setDueDate("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditForm({ ...task });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}`, {
        title: editForm.title,
        status: editForm.status,
        priority: editForm.priority,
        dueDate: editForm.dueDate,
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium text-gray-700">
        Loading your workspace...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-8">
      {/* Full-width container tailored for a card-based layout */}
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 border border-red-200"
          >
            Logout
          </button>
        </div>

        {/* Controls Section: Create & Filter */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Create Task Card */}
          <div className="col-span-1 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Add New Task
            </h2>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task title..."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Create Task
              </button>
            </form>
          </div>

          {/* Filters & Sorting Card */}
          <div className="col-span-1 lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Filter & Sort
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Sort By...</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                disabled={!sortBy}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-200">
              No tasks match your criteria. Create one to get started!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* --- EDIT MODE --- */}
                {editingId === task._id ? (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="rounded border border-gray-300 px-2 py-1 font-medium"
                    />
                    <div className="flex gap-2">
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            status: e.target.value as any,
                          })
                        }
                        className="w-1/2 rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                      <select
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            priority: e.target.value as any,
                          })
                        }
                        className="w-1/2 rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(task._id)}
                        className="flex-1 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- VIEW MODE --- */
                  <>
                    <div>
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {task.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${
                            task.priority === "HIGH"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-700">
                            Status:
                          </span>{" "}
                          {task.status.replace("_", " ")}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            Due:
                          </span>{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                      <button
                        onClick={() => startEditing(task)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
