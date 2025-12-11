// import { useContext, useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { apiClient } from "../clients/api";
// import type { Project } from "../types";
// import { AuthContext } from "../context/AuthProvider";

// type TaskStatus = "todo" | "in-progress" | "done";

// interface Task {
//   _id: string;
//   title: string;
//   description?: string;
//   status: TaskStatus;
// }

// function TaskPage() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const auth = useContext(AuthContext);

//   const [project, setProject] = useState<Project | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Form state (used for both create & edit)
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState<TaskStatus>("todo");
//   const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

//   // Optional filter by status (nice for UX/rubric)
//   const [filterStatus, setFilterStatus] = useState<"all" | TaskStatus>("all");

//   // If not logged in, you shouldn't be here
//   useEffect(() => {
//     if (!auth?.user) {
//       navigate("/auth");
//     }
//   }, [auth?.user, navigate]);

//   useEffect(() => {
//     if (!projectId) return;

//     const fetchProjectAndTasks = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const [projectRes, tasksRes] = await Promise.all([
//           apiClient.get(`/api/projects/${projectId}`),
//           apiClient.get(`/api/projects/${projectId}/tasks`),
//         ]);

//         setProject(projectRes.data);
//         setTasks(tasksRes.data);
//       } catch (err: any) {
//         console.error(err);
//         const message =
//           err.response?.data?.message || err.message || "Error loading tasks";
//         setError(message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectAndTasks();
//   }, [projectId]);

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setStatus("todo");
//     setEditingTaskId(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!projectId || !title.trim()) return;

//     try {
//       setLoading(true);
//       setError("");

//       if (editingTaskId) {
//         // UPDATE existing task
//         const res = await apiClient.put(
//           `/api/projects/${projectId}/tasks/${editingTaskId}`,
//           { title, description, status }
//         );
//         const updatedTask: Task = res.data;

//         setTasks(prev =>
//           prev.map(t => (t._id === editingTaskId ? updatedTask : t))
//         );
//       } else {
//         // CREATE new task
//         const res = await apiClient.post(`/api/projects/${projectId}/tasks`, {
//           title,
//           description,
//           status,
//         });
//         const newTask: Task = res.data;
//         setTasks(prev => [...prev, newTask]);
//       }

//       resetForm();
//     } catch (err: any) {
//       console.error(err);
//       const message =
//         err.response?.data?.message ||
//         err.message ||
//         "Error submitting task form";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = (task: Task) => {
//     setEditingTaskId(task._id);
//     setTitle(task.title);
//     setDescription(task.description || "");
//     setStatus(task.status);
//   };

//   const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
//     if (!projectId) return;

//     try {
//       const res = await apiClient.put(
//         `/api/projects/${projectId}/tasks/${taskId}`,
//         { status: newStatus }
//       );
//       const updated: Task = res.data;
//       setTasks(prev => prev.map(t => (t._id === taskId ? updated : t)));
//     } catch (err: any) {
//       console.error(err);
//       const message =
//         err.response?.data?.message || err.message || "Error updating status";
//       setError(message);
//     }
//   };

//   const handleDeleteTask = async (taskId: string) => {
//     if (!projectId) return;

//     try {
//       await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
//       setTasks(prev => prev.filter(t => t._id !== taskId));
//     } catch (err: any) {
//       console.error(err);
//       const message =
//         err.response?.data?.message || err.message || "Error deleting task";
//       setError(message);
//     }
//   };

//   const filteredTasks =
//     filterStatus === "all"
//       ? tasks
//       : tasks.filter(t => t.status === filterStatus);

//   if (loading && !project && tasks.length === 0) {
//     return <div className="text-3xl text-white">Loading...</div>;
//   }

//   if (error && !project) {
//     return (
//       <div className="text-3xl text-red-400">
//         Error: {error || "Error loading project"}
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="text-3xl text-white">
//         Project not found.
//       </div>
//     );
//   }

//   return (
//     <div className="text-white max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         <Link to="/projects" className="text-blue-400 hover:underline">
//           ← Back to Projects
//         </Link>
//         <span className="text-sm text-gray-300">
//           Logged in as: {auth?.user?.username}
//         </span>
//       </div>

//       <h1 className="text-4xl mb-2">Tasks for: {project.name}</h1>
//       <p className="text-gray-300 mb-6">{project.description}</p>

//       {error && (
//         <div className="mb-4 text-red-400 bg-red-900/40 p-2 rounded">
//           {error}
//         </div>
//       )}

//       {/* Task Form (Create / Edit) */}
//       <section className="mb-8 bg-slate-800 p-4 rounded">
//         <h2 className="text-2xl mb-3">
//           {editingTaskId ? "Edit Task" : "Add Task"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div>
//             <label className="block text-sm mb-1">Title</label>
//             <input
//               className="w-full p-2 rounded bg-slate-900 border border-slate-700"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Description</label>
//             <textarea
//               className="w-full p-2 rounded bg-slate-900 border border-slate-700"
//               value={description}
//               onChange={e => setDescription(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Status</label>
//             <select
//               className="w-full p-2 rounded bg-slate-900 border border-slate-700"
//               value={status}
//               onChange={e => setStatus(e.target.value as TaskStatus)}
//             >
//               <option value="todo">To Do</option>
//               <option value="in-progress">In Progress</option>
//               <option value="done">Done</option>
//             </select>
//           </div>

//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
//               disabled={loading}
//             >
//               {editingTaskId ? "Save Changes" : "Create Task"}
//             </button>
//             {editingTaskId && (
//               <button
//                 type="button"
//                 className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded"
//                 onClick={resetForm}
//               >
//                 Cancel Edit
//               </button>
//             )}
//           </div>

//           {loading && <div className="text-sm animate-pulse">Saving...</div>}
//         </form>
//       </section>

//       {/* Filter Controls */}
//       <section className="mb-4 flex gap-2 items-center">
//         <span className="text-sm">Filter:</span>
//         {["all", "todo", "in-progress", "done"].map(v => (
//           <button
//             key={v}
//             type="button"
//             onClick={() => setFilterStatus(v as any)}
//             className={`px-3 py-1 rounded text-sm ${
//               filterStatus === v
//                 ? "bg-blue-500"
//                 : "bg-slate-700 hover:bg-slate-600"
//             }`}
//           >
//             {v === "all" ? "All" : v.replace("-", " ")}
//           </button>
//         ))}
//       </section>

//       {/* Task List */}
//       <section>
//         <h2 className="text-2xl mb-2">
//           Tasks ({filteredTasks.length}/{tasks.length})
//         </h2>

//         {filteredTasks.length === 0 ? (
//           <p className="text-gray-400">No tasks match this filter.</p>
//         ) : (
//           <ul className="space-y-3">
//             {filteredTasks.map(task => (
//               <li
//                 key={task._id}
//                 className="bg-slate-800 p-4 rounded flex flex-col gap-2"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="font-semibold">{task.title}</span>
//                   <span className="text-xs uppercase text-gray-300">
//                     {task.status}
//                   </span>
//                 </div>
//                 {task.description && (
//                   <p className="text-gray-300 text-sm">{task.description}</p>
//                 )}

//                 <div className="flex flex-wrap gap-2 mt-2 text-xs">
//                   {/* Quick status buttons */}
//                   <button
//                     className="px-2 py-1 bg-slate-700 rounded"
//                     onClick={() => handleUpdateStatus(task._id, "todo")}
//                   >
//                     To Do
//                   </button>
//                   <button
//                     className="px-2 py-1 bg-slate-700 rounded"
//                     onClick={() =>
//                       handleUpdateStatus(task._id, "in-progress")
//                     }
//                   >
//                     In Progress
//                   </button>
//                   <button
//                     className="px-2 py-1 bg-slate-700 rounded"
//                     onClick={() => handleUpdateStatus(task._id, "done")}
//                   >
//                     Done
//                   </button>

//                   {/* Edit/Delete */}
//                   <button
//                     className="px-2 py-1 bg-blue-600 rounded"
//                     onClick={() => handleEditClick(task)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="px-2 py-1 bg-red-600 rounded"
//                     onClick={() => handleDeleteTask(task._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

// export default TaskPage;