export interface BlogPost {
    title: string;
    alias: string;
    short_desc: string;
    main_image: string;
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
