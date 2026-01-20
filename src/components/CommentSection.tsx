import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    User: {
        username: string;
    };
}

interface CommentSectionProps {
    postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { isAuthenticated, user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/interactions/comments/${postId}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/interactions/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: newComment, PostId: postId })
            });

            if (response.ok) {
                setNewComment("");
                fetchComments();
                toast.success("Comment posted");
            } else {
                toast.error("Failed to post comment");
            }
        } catch (error) {
            toast.error("Error posting comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({comments.length})
            </h3>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                    <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
                            <Send className="w-3 h-3 mr-2" />
                            {loading ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="bg-muted p-3 rounded-lg text-sm text-center mb-6">
                    Please <a href="/login" className="text-primary font-bold hover:underline">sign in</a> to join the conversation.
                </div>
            )}

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs uppercase bg-primary/10 text-primary font-bold">
                                    {comment.User.username.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold">{comment.User.username}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-line">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
