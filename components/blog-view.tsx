"use client";

import React, { useState } from "react";
import Image from "next/image";
import { fetchBlogDetail, BlogPost } from "@/lib/api";

interface BlogPost {
    title: string;
    alias: string;
    short_desc: string;
    main_image: string;
}

interface BlogViewProps {
    posts?: BlogPost[];
}

export function BlogView({ posts = [] }: BlogViewProps) {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // Function to handle post selection
    const handlePostClick = async (post: BlogPost) => {
        setSelectedPost(post);

        // If content is missing, fetch it
        if (!post.content) {
            setIsLoadingDetail(true);
            try {
                const detail = await fetchBlogDetail(post.id);
                if (detail) {
                    setSelectedPost(detail);
                }
            } catch (error) {
                console.error("Failed to fetch detail:", error);
            } finally {
                setIsLoadingDetail(false);
            }
        }
    };

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-zinc-500">
                <p>Henüz içerik bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto p-4 pb-24">
            <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 px-2 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md py-4 z-10">
                İlham Veren Fikirler
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post, index) => (
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

            {/* Basic Modal for Detail View */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
                    <div
                        className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative h-64 w-full">
                            <Image
                                src={selectedPost.main_image}
                                alt={selectedPost.title}
                                fill
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
                                <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                    {selectedPost.short_desc}
                                </p>

                                {isLoadingDetail ? (
                                    <div className="py-12 flex justify-center">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    selectedPost.content && (
                                        <div
                                            className="mt-6 text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4"
                                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                        />
                                    )
                                )}

                                <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                                        Bu içerik Filli Boya blogundan alınmıştır. Detaylı bilgi için filliboya.com'u ziyaret edebilirsiniz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
