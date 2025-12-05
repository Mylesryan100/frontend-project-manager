// import { useState } from 'react'
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

function App() {
  return (
    <>
      <div className="p-5 bg-zinc-900 h-screen">
        <h1 className="text-3xl font-bold text-white">Project Manager App</h1>

        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/projects" element={<ProjectsPage />}/>
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />}/>
        </Routes>  
      </div>
    </>
  );
}

export default App;
