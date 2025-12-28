"use client";

import React, { ReactNode, useRef, useEffect, useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import { AI } from "./actions";
import Image from "next/image";
import { BottomNavigation } from "@/components/bottom-navigation";
import { BlueText } from "@/components/blue-text";
import { LoadingDots } from "@/components/loading-dots";
import { ProjectsView } from "@/components/projects-view";
import { ProjectDetailView } from "@/components/project-detail-view";
import { ImageSlider } from "@/components/slider";

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  image: string | null;
  category: string;
}

export default function Home() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { sendMessageWithContext, showProjectDetail } = useActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [currentTool, setCurrentTool] = useState<ReactNode | null>(null);
  const [currentToolType, setCurrentToolType] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<
    Array<{ id: number; component: ReactNode }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isBlur, setIsBlur] = useState(true);
  const [isSliding, setIsSliding] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("Main page: useUIState messages:", messages.length, messages);
  }, [messages]);

  // Fetch projects data on component mount for LLM context
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects data for LLM context...");
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjectsData(data.projects || []);
        console.log(
          "Projects data loaded:",
          data.projects?.length || 0,
          "projects"
        );
      } catch (error) {
        console.error("Error fetching projects for context:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project click
  const handleProjectClick = async (projectId: string) => {
    console.log("Main page: Project clicked:", projectId);
    setIsProcessing(true);
    setTextOverlays([]);

    setCurrentTool(
      <ProjectDetailView projectId={projectId} onBack={handleBackToProjects} />
    );
    setCurrentToolType("project_detail");

    // Briefly show a text overlay
    const toolOverlayId = Date.now();
    setTextOverlays([
      {
        id: toolOverlayId,
        component: <BlueText>Loading project details...</BlueText>,
      },
    ]);

    setTimeout(() => {
      setTextOverlays((prev) =>
        prev.filter((overlay) => overlay.id !== toolOverlayId)
      );
    }, 2000); // Shorter duration

    setIsProcessing(false);
  };

  // Handle back to projects
  const handleBackToProjects = () => {
    console.log("Main page: Going back to projects");
    setCurrentTool(<ProjectsView onProjectClick={handleProjectClick} />);
    setCurrentToolType("projects");
  };

  // Clean AI-driven message handler
  const handleAIMessage = async (userMessage: string) => {
    console.log("Main page: handleAIMessage called with:", userMessage);
    setIsProcessing(true);

    try {
      console.log(
        "Main page: calling sendMessage with current tool:",
        currentToolType
      );

      console.log(
        "Main page: Projects data being sent:",
        projectsData.length,
        "projects:",
        projectsData
      );

      // Send message with current tool state and projects data to AI for decision making
      const response = await sendMessageWithContext(
        userMessage,
        currentToolType
      );
      console.log("Main page: got AI response:", response);

      if (response.type && response.type != 'text') {
        //setIsBlur(false);
        setIsSliding(false);
      }
      if (response.tool && response.tool == 'colors') {
        setIsBlur(true);
      }

      // Execute the AI's decision
      switch (response.type) {
        case "project_detail":
          console.log(
            "✅ AI decided to show project detail:",
            response.projectId
          );
          setTextOverlays([]);
          setCurrentTool(
            <ProjectDetailView
              projectId={response.projectId}
              onBack={handleBackToProjects}
            />
          );
          setCurrentToolType("project_detail");
          break;

        case "tool":
          console.log("✅ AI decided to show tool:", response.tool);
          // Clear text overlays and show new tool
          setTextOverlays([]);

          // Special handling for projects tool to include click handler
          if (response.tool === "projects") {
            console.log(
              "Main page: Setting projects tool with relatedProjectIds:",
              response.relatedProjectIds
            );
            setCurrentTool(
              <ProjectsView
                onProjectClick={handleProjectClick}
                relatedProjectIds={response.relatedProjectIds}
              />
            );
          } else {
            setCurrentTool(response.component);
          }
          setCurrentToolType(response.tool);

          // Show contextual text briefly
          const toolOverlayId = Date.now();
          setTimeout(() => {
            setTextOverlays([
              {
                id: toolOverlayId,
                component: <BlueText>{response.response}</BlueText>,
              },
            ]);

            // Auto-remove after 5 seconds
            setTimeout(() => {
              setTextOverlays((prev) =>
                prev.filter((overlay) => overlay.id !== toolOverlayId)
              );
            }, 500000);
          }, 300);
          break;

        case "text":
          console.log("🔵 AI decided to show text response");
          // Show text overlay (keeping current tool if any)
          const textOverlayId = Date.now();
          setTextOverlays([]);
          setTimeout(() => {
            setTextOverlays([
              {
                id: textOverlayId,
                component: response.component,
              },
            ]);

            // Auto-remove after 6 seconds
            setTimeout(() => {
              setTextOverlays((prev) =>
                prev.filter((overlay) => overlay.id !== textOverlayId)
              );
            }, 600000);
          }, 10);
          break;

        default:
          console.warn("Unknown response type:", response);
      }

      // Update messages array
      if (response.type !== "project_detail") {
        setMessages((prevMessages) => [...prevMessages, response.component]);
      }
    } catch (error) {
      console.error("Main page: error in sendMessage:", error);

      // Show error as text overlay
      const errorOverlayId = Date.now();
      setTextOverlays([
        {
          id: errorOverlayId,
          component: (
            <BlueText>Sorry, something went wrong. Please try again.</BlueText>
          ),
        },
      ]);

      setTimeout(() => {
        setTextOverlays((prev) =>
          prev.filter((overlay) => overlay.id !== errorOverlayId)
        );
      }, 6000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white dark:bg-zinc-900">
      <main style={{ margin: 0, padding: 0 }}>
        <ImageSlider isBlur={isBlur} isSliding={isSliding} />
        { }
      </main>
      <div
        ref={messagesContainerRef}
        className="w-full h-screen overflow-auto absolute top-0 left-0"
      >
        {/* Show persistent tool if available */}
        {currentTool && (
          <div className="w-full h-full">
            <React.Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <div className="text-lg text-blue-600">
                    Loading {currentToolType}...
                  </div>
                  <div className="text-sm text-gray-500">
                    This may take a few moments
                  </div>
                </div>
              }
            >
              {currentTool}
            </React.Suspense>
          </div>
        )}

        {/* If no tool, show welcome message or latest message */}
        {!currentTool && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="items-center text-center space-y-4">
              <Image
                src="/images/filli-logo.png"
                alt="AI Assistant"
                width={128}
                height={128}
                className="block mx-auto mb-4"
              />
              <p className="text-xl text-gray-700 dark:text-gray-400">
                Renklerin akıllı dünyasına hoş geldiniz!
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text overlays - appear over everything */}
      {textOverlays.map((overlay) => (
        <div key={overlay.id}>{overlay.component}</div>
      ))}

      {/* Loading dots - show when processing */}
      {isProcessing && <LoadingDots />}

      <BottomNavigation
        onMessage={handleAIMessage}
        isProcessing={isProcessing}
        hasMessages={messages.length > 0}
      />
    </div>
  );
}
