"use server";

export interface BlogPost {
    id: string;
    title: string;
    alias: string;
    short_desc: string;
    main_image: string;
    content?: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const response = await fetch("https://filliboya.com/api.php", {
            method: "POST",
            body: JSON.stringify({ job: "get_blog_list" }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }

        const data = await response.json();
        // Validate if data is array, if not return empty
        if (!Array.isArray(data)) {
            console.error("Blog API returned non-array data:", data);
            return [];
        }

        return data;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
}

export async function fetchBlogDetail(id: string): Promise<BlogPost | null> {
    console.log("Fetching blog detail for id:", id);
    try {
        const response = await fetch("https://filliboya.com/api.php", {
            method: "POST",
            body: JSON.stringify({ job: "get_blog_details", id: id }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch blog detail: ${response.status}`);
        }

        const data = await response.json();
        if (!data || typeof data !== "object") {
            console.error("Blog API returned invalid data:", data);
            return null;
        }

        return data;

    } catch (error) {
        console.error("Error fetching blog detail:", error);
        return null;
    }
}

export interface Painter {
    selected: boolean;
    Name: string;
    SurName: string;
    ProfilePhotoLink: string;
    ExperienceYear: string;
    MasterPainterId: string;
    badge: any;
}

export async function fetchPainters(): Promise<Painter[]> {
    try {
        const response = await fetch("https://api.filliustam.com/api.php", {
            method: "POST",
            body: JSON.stringify({ job: "search_painters_all", city: "128" }), // Defaulting to Istanbul (128)
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch painters: ${response.status}`);
        }

        const data = await response.json();
        // Validate if data is array
        if (!Array.isArray(data)) {
            console.error("Painters API returned non-array data:", data);
            return [];
        }

        // Process data to fix image URLs
        return data.map((painter: any) => ({
            ...painter,
            ProfilePhotoLink: painter.ProfilePhotoLink
                ? painter.ProfilePhotoLink.replace("../", "https://filliustam.com/")
                : null
        }));
    } catch (error) {
        console.error("Error fetching painters:", error);
        return [];
    }
}

