import { Message } from "@/components/message";
import { azure } from "@ai-sdk/azure";
import { CoreMessage, generateId, generateText } from "ai";
import {
  createAI,
  getMutableAIState,
  streamUI,
  getAIState,
  createStreamableValue,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { CameraView } from "@/components/camera-view";
import { HubView } from "@/components/hub-view";
import { UsageView } from "@/components/usage-view";
import { ContactsView } from "@/components/contacts-view";
import { ProjectsView } from "@/components/projects-view";
import { ProjectDetailView } from "@/components/project-detail-view";
import { BlueText } from "@/components/blue-text";
import { ColorsView } from "@/components/colors";
import { ProductsView } from "@/components/products";

export interface Hub {
  climate: Record<"low" | "high", number>;
  lights: Array<{ name: string; status: boolean }>;
  locks: Array<{ name: string; isLocked: boolean }>;
}

let hub: Hub = {
  climate: {
    low: 23,
    high: 25,
  },
  lights: [
    { name: "patio", status: true },
    { name: "kitchen", status: false },
    { name: "garage", status: true },
  ],
  locks: [{ name: "back door", isLocked: true }],
};

import { ALL_COLORS } from "@/lib/colors";
import { fetchBlogPosts } from "@/lib/api";
import { BlogView } from "@/components/blog-view";

// Lightweight intent analysis to determine required context
const analyzeIntent = async (query: string): Promise<{ needsProjects: boolean; needsColors: boolean; needsBlog: boolean }> => {
  try {
    const result = await generateText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"),
      temperature: 0,
      system: `You are an intent classifier. Analyze the user query to determine if it requires specific data context.
Return a JSON object with:
- "needsProjects": true if user asks about portfolio, case studies, specific project details, or client work.
- "needsColors": true if user asks about paint colors, recommendations, suggestions for room painting, or specific color names.
- "needsBlog": true if user asks for inspiration, ideas, blog posts, decoration tips, "ilham veren", "fikir", "garden", "flowers".

Examples:
"Show me office projects" -> {"needsProjects": true, "needsColors": false, "needsBlog": false}
"What color should I paint my dark room?" -> {"needsProjects": false, "needsColors": true, "needsBlog": false}
"Give me some decoration ideas" -> {"needsProjects": false, "needsColors": false, "needsBlog": true}
"Show me green projects" -> {"needsProjects": true, "needsColors": true, "needsBlog": false}

Respond ONLY with valid JSON.`,
      prompt: query,
    });

    const intent = JSON.parse(result.text);
    return {
      needsProjects: intent.needsProjects || false,
      needsColors: intent.needsColors || false,
      needsBlog: intent.needsBlog || false,
    };
  } catch (error) {
    console.error("Intent analysis failed:", error);
    // Fallback: err on the side of caution and include data if unsure, or exclude to be safe.
    // Let's assume false to avoid crashes, or check keywords manually.
    const lowerQuery = query.toLowerCase();
    return {
      needsProjects: lowerQuery.includes("project") || lowerQuery.includes("proje") || lowerQuery.includes("ofis") || lowerQuery.includes("villa"),
      needsColors: lowerQuery.includes("color") || lowerQuery.includes("renk") || lowerQuery.includes("boya") || lowerQuery.includes("paint"),
      needsBlog: lowerQuery.includes("idea") || lowerQuery.includes("fikir") || lowerQuery.includes("blog") || lowerQuery.includes("ilham"),
    };
  }
};

// AI-driven decision making function
const makeDecision = async (
  userQuery: string,
  currentTool: string | null,
  // projectsData arg is deprecated but kept for signature compatibility if needed, though we won't use it from client
  _unusedClientData: any[] = []
) => {
  "use server";

  // 1. Analyze Intent
  const intent = await analyzeIntent(userQuery);
  console.log("Server: Intent Analysis:", intent);

  // 2. Prepare Contexts based on Intent

  // -- Projects Context --
  let projectsContext = "";
  if (intent.needsProjects) {
    let projectsToUse = [];
    try {
      console.log("Server: Fetching projects data for context...");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/projects`
      );
      if (response.ok) {
        const data = await response.json();
        projectsToUse = data.projects || [];
      }
    } catch (error) {
      console.error("Server: Error fetching projects:", error);
    }

    if (projectsToUse.length > 0) {
      projectsContext = `\n\nAVAILABLE PROJECTS DATA:\n${projectsToUse
        .map(
          (project: any) =>
            `ID: ${project.id}, Title: "${project.title}", Client: "${project.client
            }", Category: "${project.category
            }", Description: "${project.description.substring(0, 100)}..."`
        )
        .join("\n")}`;
    }
  }

  // -- Colors Context --
  // -- Colors Context --
  let colorsContext = "";
  if (intent.needsColors) {
    colorsContext = `\n\nAVAILABLE COLORS:\n${ALL_COLORS.map(
      (c) => `- ${c.name} (Code: ${c.code})`
    ).join("\n")}`;
  }

  // -- Blog Context --
  let blogContext = "";
  if (intent.needsBlog) {
    console.log("Server: Fetching blog posts for context...");
    const blogPosts = await fetchBlogPosts();
    if (blogPosts.length > 0) {
      blogContext = `\n\nAVAILABLE BLOG POSTS (INSPIRATION IDEAS):\n${blogPosts
        .slice(0, 5) // Limit context to first 5 posts to save tokens
        .map(
          (post: any) =>
            `- Title: "${post.title}", Desc: "${post.short_desc.substring(0, 100)}..."`
        )
        .join("\n")}`;
    }
  }

  console.log(
    "Server: Contexts prepared.",
    "Projects:", !!projectsContext,
    "Colors:", !!colorsContext,
    "Blog:", !!blogContext
  );

  const result = await generateText({
    model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"),
    temperature: 0.1,
    system: `You are an AI assistant for Filliboya Web Site. You help users navigate tools and projects.
    
AVAILABLE TOOLS:
1. colors - All the colors that Filliboya offers. Contains color names, codes, and images.
2. products - All the products that Filliboya offers. Contains product names, descriptions, images, and categories.
3. blog - "Ilham Veren Fikirler" (Inspiration Ideas). Contains blog titles, authors, dates, and content about decoration, flowers, home application etc.
4. services - Services offered by Filliboya. Contains service names, descriptions, and images.
5. contact - Contact information for Filliboya. Contains email, phone number, and address.

CURRENT STATE: ${currentTool
        ? `Currently displaying: ${currentTool}`
        : "No tool currently displayed"
      }${projectsContext}${colorsContext}${blogContext}

YOUR JOB: Analyze the user query and decide what action to take. Return a JSON object with:
{
  "action": "show_tool" | "same_tool" | "text_only" | "show_project_detail" | "show_related_projects",
  "tool": "colors" | "products" | "services" | "contact" | "blog" | "painter-services" | null,
  "projectId": "string" | null,
  "relatedProjectIds": "string[]" | null,
  "response": "your response text here"
}

DECISION RULES:
- If query asks for a tool that's NOT currently displayed → action: "show_tool", tool: "toolname"
- If query asks for a tool that IS currently displayed → action: "same_tool", tool: null  
- If query asks for a specific project by ID (e.g., "show project 20", "project 15") → action: "show_project_detail", projectId: "20"
- If query mentions projects by name/client/category and you can find related projects → action: "show_related_projects", relatedProjectIds: ["id1", "id2", "id3"]
- If query asks for inspiration, decoration ideas, or blog posts → action: "show_tool", tool: "blog"
- If query is general/conversational (not tool-related) → action: "text_only", tool: null

If the user asks for color advice or specific colors, use the AVAILABLE COLORS list to make recommendations.
If the user asks for a paint product try to find out which type of paint they are looking for (e.g., interior, exterior, etc.) and return the relevant products.

IMPORTANT: When finding related projects, look at the AVAILABLE PROJECTS DATA above and return the actual project IDs that match the user's query. Do NOT use hardcoded IDs.

EXAMPLES:
Query: "show cameras" + Current: null → {"action": "show_tool", "tool": "cameras", "projectId": null, "relatedProjectIds": null, "response": "Here are your security camera feeds"}
Query: "show projects" + Current: null → {"action": "show_tool", "tool": "projects", "projectId": null, "relatedProjectIds": null, "response": "Here are the projects from our portfolio"}
Query: "show project 20" + Current: null → {"action": "show_project_detail", "tool": null, "projectId": "20", "relatedProjectIds": null, "response": "Here are the details for project 20"}
Query: "project 15" + Current: null → {"action": "show_project_detail", "tool": null, "projectId": "15", "relatedProjectIds": null, "response": "Here are the details for project 15"}
Query: "tell me about Filli Boya projects" + Current: null → {"action": "show_related_projects", "tool": null, "projectId": null, "relatedProjectIds": ["19"], "response": "Here are the Filli Boya projects from our portfolio"}
Query: "what is your email" + Current: null → {"action": "show_tool", "tool": "contacts", "projectId": null, "relatedProjectIds": null, "response": "You can find our contact information here"}
Query: "show me green colors" (if colors in context) -> {"action": "text_only", "tool": "colors", "response": "Here are some green options: Kaktüs 90, Kaktüs 50..."}
Query: "I need inspiration for my living room" -> {"action": "show_tool", "tool": "blog", "response": "Here are some inspiration ideas for your living room."}
Query: "what is AI" + Current: "cameras" → {"action": "text_only", "tool": null, "projectId": null, "relatedProjectIds": null, "response": "AI stands for Artificial Intelligence..."}

Always respond with valid JSON only. No other text.`,
    prompt: `User query: "${userQuery}"`,
  });

  console.log("Server: LLM raw response:", result.text);

  try {
    return JSON.parse(result.text);
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      action: "text_only",
      tool: null,
      projectId: null,
      relatedProjectIds: null,
      response: result.text,
    };
  }
};

const sendMessage = async (
  message: string,
  currentTool: string | null = null,
  projectsData: any[] = []
) => {
  "use server";

  console.log(
    "Server: Processing message:",
    message,
    "Current tool:",
    currentTool,
    "Projects data available:",
    projectsData.length
  );

  // Get AI decision
  const decision = await makeDecision(message, currentTool, projectsData);
  console.log("Server: AI Decision:", decision);

  const messages = getMutableAIState<typeof AI>("messages");

  // Add user message to history
  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  // Execute the decision
  switch (decision.action) {
    case "show_project_detail":
      // Return project detail component
      const projectDetailComponent = (
        <ProjectDetailView projectId={decision.projectId!} />
      );

      // Add project detail response to history
      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: `Showing project detail for ID ${decision.projectId}: ${decision.response}`,
        },
      ]);

      return {
        type: "tool",
        tool: "project_detail",
        component: projectDetailComponent,
        response: decision.response,
      };

    case "show_tool":
      // Return the appropriate tool component
      let toolComponent;
      switch (decision.tool) {
        case "cameras":
          toolComponent = <CameraView />;
          break;
        case "colors":
          console.log("Server: Showing colors tool");
          toolComponent = <ColorsView />;
          break;
        case "products":
          console.log("Server: Showing products tool");
          toolComponent = <ProductsView />;
          break;
        case "hub":
          toolComponent = <HubView hub={hub} />;
          break;
        case "usage":
          toolComponent = <UsageView type="electricity" />;
          break;
        case "contacts":
          toolComponent = <ContactsView />;
          break;
        case "projects":
          toolComponent = <ProjectsView />;
          break;
        case "blog":
          // Fetch blog posts if not already fetched (or re-fetch, it's cheap)
          const blogPosts = await fetchBlogPosts();
          toolComponent = <BlogView posts={blogPosts} />;
          break;
        default:
          toolComponent = <BlueText>{decision.response}</BlueText>;
      }

      // Add tool response to history
      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: `Showing ${decision.tool} tool: ${decision.response}`,
        },
      ]);

      return {
        type: "tool",
        tool: decision.tool,
        component: toolComponent,
        response: decision.response,
      };

    case "same_tool":
    case "text_only":
      // Return text response
      messages.done([
        ...(messages.get() as CoreMessage[]),
        { role: "assistant", content: decision.response },
      ]);

      return {
        type: "text",
        tool: null,
        component: <BlueText>{decision.response}</BlueText>,
        response: decision.response,
      };

    case "show_related_projects":
      // Return related projects component
      const relatedProjectsComponent = (
        <ProjectsView relatedProjectIds={decision.relatedProjectIds!} />
      );

      // Add related projects response to history
      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: `Showing related projects for IDs: ${decision.relatedProjectIds.join(
            ", "
          )}`,
        },
      ]);

      return {
        type: "tool",
        tool: "projects",
        component: relatedProjectsComponent,
        response: decision.response,
        relatedProjectIds: decision.relatedProjectIds,
      };

    default:
      // Fallback
      return {
        type: "text",
        tool: null,
        component: <BlueText>{decision.response}</BlueText>,
        response: decision.response,
      };
  }
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage: async (message: string) => {
      "use server";
      return await sendMessage(message, null);
    },
    sendMessageWithContext: async (
      message: string,
      currentTool: string | null = null,
      projectsData: any[] = []
    ) => {
      "use server";
      return await sendMessage(message, currentTool, projectsData);
    },
    showProjectDetail: async (projectId: string) => {
      "use server";

      console.log("Server: Showing project detail for ID:", projectId);

      const messages = getMutableAIState<typeof AI>("messages");

      // Add project detail response to history
      messages.done([
        ...(messages.get() as CoreMessage[]),
        {
          role: "assistant",
          content: `Showing project detail for ID ${projectId}`,
        },
      ]);

      return {
        type: "project_detail",
        projectId: projectId,
        response: `Here are the details for project ${projectId}`,
      };
    },
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
