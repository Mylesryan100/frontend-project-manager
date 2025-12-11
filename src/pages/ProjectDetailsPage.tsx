import { useEffect, useState } from "react";
import { apiClient } from "../clients/api";
import { useParams } from "react-router-dom";
import type { Project } from "../types";
import type { Task } from "../types";
import TaskForm from "../components/TaskForm";

function ProjectDetailsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]) 
  const { projectId } = useParams();
console.log(tasks);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/projects/${projectId}`);
        console.log(res.data);
        setProject(res.data);
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);
useEffect(() => {
    const fetchProjectTasks = async () => {
        try {
          setLoading(true);
            const res = await apiClient.get(`/api/projects/${projectId}/tasks`);
            console.log(res.data);
            setTasks(res.data);
        } catch (error: any) {
            console.error(error);
            setError(error);
        } finally {
          setLoading(false);
        }
    };

    fetchProjectTasks()
  }, [projectId]);

  // const handleTaskUpdate =(updatedTask: Task) => {
  //   setTasks(prevTasks =>
  //     prevTasks.map(task => 
  //       task._id === updatedTask._id ? updatedTask: task
  //     )
  //   );
  //   setShowEditForm(null);
  // };

//   const handleTaskDelete = async (taskId: string) => {
//   try {
//     await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
//     setTasks(prev => prev.filter(task => task._id !== taskId));
//   } catch (err) {
//     console.error(err);
//   }
// };

  if (loading) return <div className="text-3xl text-white">Loading...</div>;

  if (error) return <div className="text-3xl text-white">Error loading Project</div>;

  return (
    <div className="text-white">
      <h1 className="text-4xl">Project Details Page</h1>

      <div className="mt-10">
        <div className="text-3xl">{project?.name}</div>
        <div className="text-xl">{project?.description}</div>
      </div>

    <h1>Tasks</h1>

    {projectId && <TaskForm projectId={projectId} />}
     {tasks && tasks.map(task => (
       <div key= {task._id} className="mt-15">

        <div className="text-2x1">{task?.title}</div>
        <div className="text-2x1">{task?.description}</div>
        <div className="text-2x1">{task?.status}</div>
{/* <button className="mt-auto bg-sky-500 rounded" onClick={()=> setShowEditForm(task._id)}>Edit</button> */}
        {/* {showEditForm === task._id && (
          <TaskForm projectId={projectId} task={task} onUpdate={handleTaskUpdate}/>
          )} */}
        {/* <button className="mt-auto bg-red-600 rounded" onClick={()=> handleTaskDelete(task._id)}>Delete</button> */}



      </div>
     ))}


    </div>
  );
}

export default ProjectDetailsPage;
