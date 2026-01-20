import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import CommentSection from '@/components/CommentSection';

interface Post {
    id: number;
    title: string;
    content: string;
    image: string;
    createdAt: string;
    author: string;
}

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-24 px-4 space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-24 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-primary">Farm News & Updates</h1>
            <div className="grid gap-8 max-w-4xl mx-auto">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10">
                            {post.image && (
                                <div className="w-full h-64 overflow-hidden">
                                    <img
                                        src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{post.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} by {post.author || 'Admin'}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-line text-lg leading-relaxed text-foreground/80">{post.content}</p>
                                </div>
                                <CommentSection postId={post.id} />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Blog;
