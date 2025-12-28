"use client";

import React, { useState } from "react";
import Image from "next/image";
import { fetchBlogDetail, BlogPost } from "@/lib/api";

interface BlogViewProps {
    posts?: BlogPost[];
}

export function BlogView({ posts = [] }: BlogViewProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const handleLoadMore = () => {
        setVisibleCount((prev: number) => prev + 6);
    };

    // Function to handle post selection
    const handlePostClick = async (post: BlogPost) => {
        // Set selected immediately to show modal
        setSelectedPost(post);

        // If content is already present, no need to fetch
        if (post.content) {
            return;
        }

        // If content is missing, fetch it
        setIsLoadingDetail(true);
        try {
            const detail = await fetchBlogDetail(post.id);
            if (detail && detail.content) {
                // Update the selected post with full details including content
                setSelectedPost(detail);
            } else {
                console.warn("Detail fetch returned no content for id:", post.id);
            }
        } catch (error) {
            console.error("Failed to fetch detail:", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-500">
                <p>Henüz içerik bulunamadı.</p>
            </div>
        );
    }

    const visiblePosts = posts.slice(0, visibleCount);

    return (
        <div className="w-full h-full overflow-y-auto p-4 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 pt-4">
                {visiblePosts.map((post, index) => (
                    <div
                        key={index}
                        className="group flex flex-col bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-700 cursor-pointer"
                        onClick={() => handlePostClick(post)}
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={post.main_image}
                                alt={post.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-1">
                                {post.short_desc.trim()}
                            </p>
                            <div className="mt-auto">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                                    Devamını Oku →
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < posts.length && (
                <div className="flex justify-center pb-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
                    >
                        Daha Fazla Göster
                    </button>
                </div>
            )}

            {/* Basic Modal for Detail View */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
                    <div
                        className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <div className="relative h-64 w-full">
                            <Image
                                src={selectedPost.main_image}
                                alt={selectedPost.title}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{selectedPost.title}</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                {isLoadingDetail ? (
                                    <div className="py-12 flex justify-center">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    selectedPost.content && (
                                        <div
                                            className="text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4"
                                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
