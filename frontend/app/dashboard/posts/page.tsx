// app/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Post {
    id: number;
    title: string;
    description: string;
}

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchPosts() {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch("http://localhost:8000/posts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        }
        fetchPosts();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Marketplace Posts</h1>
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-gray-700">{post.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}