// import { useContext, type ReactNode } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
// import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/NavBar";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
// import { AuthContext } from "./context/AuthProvider";
// import { Navigate } from "react-router-dom";
// import TaskPage from "./pages/TaskPage";

console.log(import.meta.env.VITE_BACKEND_URL);

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const auth = useContext(AuthContext);
//   if (!auth) return null;

//   const { user } = auth;

//   if (!user) return <Navigate to="/auth" replace />;

//   return <>{children}</>;
// }



function App() {
  return (
    <>
      <div className="p-5 bg-zinc-900 h-screen">
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/projects" element={<ProjectsPage />}/>
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />}/>
          <Route path="/auth" element={<AuthPage />}/>

        </Routes>
      </div>
    </>
  );
}


















// function App() {
//   return (
//     <>
//       <div className="p-5 bg-zinc-900 h-screen">
//         <h1 className="text-3xl font-bold text-white">Project Manager App</h1>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route
//             path="/projects"
//             element={
//               <ProtectedRoute>
//                 <ProjectsPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/projects/:projectId"
//             element={
//               <ProtectedRoute>
//                 <ProjectDetailsPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/auth" element={<AuthPage />} />
//         </Routes>
//       </div>
//     </>
//   );
// }

export default App;
