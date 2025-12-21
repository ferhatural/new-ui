"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  image: string | null;
  category: string;
}

interface ProjectsViewProps {
  onProjectClick?: (projectId: string) => void;
  relatedProjectIds?: string[];
}

export const ProjectsView = ({
  onProjectClick,
  relatedProjectIds,
}: ProjectsViewProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects from API...");
        const response = await fetch("/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Projects API response:", data);
        console.log("Number of projects received:", data.projects?.length || 0);
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on relatedProjectIds
  const filteredProjects = relatedProjectIds
    ? projects.filter((project) => relatedProjectIds.includes(project.id))
    : projects;

  console.log("ProjectsView: relatedProjectIds:", relatedProjectIds);
  console.log("ProjectsView: total projects:", projects.length);
  console.log("ProjectsView: filtered projects:", filteredProjects.length);
  console.log(
    "ProjectsView: filtered project IDs:",
    filteredProjects.map((p) => p.id)
  );

  const handleProjectClick = (projectId: string) => {
    console.log("Project clicked:", projectId);
    if (onProjectClick) {
      onProjectClick(projectId);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Error loading projects
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">No projects found</p>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
            Debug: Check console for API response
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleProjectClick(project.id)}
            >
              {/* Project Image */}
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-700 relative overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                    project.image ? "hidden" : ""
                  }`}
                >
                  <span className="text-white text-3xl font-bold">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Project Title and Category */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2 text-center mb-1">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""} found
        </div>
      </div>
    </div>
  );
};
