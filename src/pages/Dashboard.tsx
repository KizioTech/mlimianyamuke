import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Users, MessageSquare, LayoutDashboard, LogOut, Package, FileText, Upload, Image as ImageIcon, AlertTriangle, TrendingUp, UserPlus, Leaf as LeafIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
    createdAt: string;
}

interface Farmer {
    id: number;
    name: string;
    phone: string;
    district: string;
    crop: string;
    alertMethod: string;
    createdAt: string;
}

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

interface Resource {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    category: string;
    createdAt: string;
}

interface Consultation {
    id: number;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    User: { username: string };
    adminResponse?: string;
    linkedResourceIds?: number[];
    linkedPostIds?: number[];
}

interface FarmReport {
    id: number;
    problemType: string;
    description: string;
    location: string;
    status: string;
    createdAt: string;
    User: { username: string };
    adminResponse?: string;
    linkedResourceIds?: number[];
    linkedPostIds?: number[];
}


interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    image?: string;
    featured: boolean;
    createdAt: string;
}

interface AnalyticsData {
    farmers: { total: number; new: number };
    traffic: { path: string; visits: number; day: string }[];
    topPosts: Post[];
}

const Dashboard: React.FC = () => {
    const { token, logout } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [reports, setReports] = useState<FarmReport[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

    // Response Dialog State
    const [selectedItem, setSelectedItem] = useState<Consultation | FarmReport | null>(null);
    const [itemType, setItemType] = useState<'consultation' | 'report' | null>(null);
    const [responseForm, setResponseForm] = useState({
        status: '',
        adminResponse: '',
        linkedResourceIds: [] as number[],
        linkedPostIds: [] as number[]
    });

    const openResponseDialog = (item: Consultation | FarmReport, type: 'consultation' | 'report') => {
        setSelectedItem(item);
        setItemType(type);
        setResponseForm({
            status: item.status,
            adminResponse: item.adminResponse || '',
            linkedResourceIds: item.linkedResourceIds || [],
            linkedPostIds: item.linkedPostIds || []
        });
    };

    const handleUpdateResponse = async () => {
        if (!selectedItem || !itemType) return;

        try {
            const endpoint = itemType === 'consultation'
                ? `/api/interactions/consultations/${selectedItem.id}`
                : `/api/interactions/reports/${selectedItem.id}`;

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(responseForm)
            });

            if (res.ok) {
                toast.success('Update successful');
                setSelectedItem(null);
                fetchData();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    // States for New Post
    const [isNewPostOpen, setIsNewPostOpen] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        image: '',
        category: 'General',
        tags: '',
        status: 'published',
        featured: false
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    // States for New Resource
    const [isNewResourceOpen, setIsNewResourceOpen] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', description: '', category: 'Guides' });
    const [resourceFile, setResourceFile] = useState<File | null>(null);
    const [uploadingResource, setUploadingResource] = useState(false);

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [postsRes, farmersRes, contactsRes, resourcesRes, consultsRes, reportsRes, testimonialsRes, analyticsRes] = await Promise.all([
                fetch('/api/posts', { headers }),
                fetch('/api/farmers', { headers }),
                fetch('/api/contacts', { headers }),
                fetch('/api/resources', { headers }),
                fetch('/api/interactions/consultations/all', { headers }),
                fetch('/api/interactions/reports/all', { headers }),
                fetch('/api/admin/testimonials', { headers }),
                fetch('/api/admin/analytics/dashboard', { headers })
            ]);

            const [postsData, farmersData, contactsData, resourcesData, consultsData, reportsData, testimonialsData, analyticsStats] = await Promise.all([
                postsRes.json(),
                farmersRes.json(),
                contactsRes.json(),
                resourcesRes.json(),
                consultsRes.json(),
                reportsRes.json(),
                testimonialsRes.json(),
                analyticsRes.json()
            ]);

            // Set data with fallbacks
            setPosts(Array.isArray(postsData) ? postsData : []);
            setFarmers(Array.isArray(farmersData) ? farmersData : []);
            setContacts(Array.isArray(contactsData) ? contactsData : []);
            setResources(Array.isArray(resourcesData) ? resourcesData : []);
            setConsultations(Array.isArray(consultsData) ? consultsData : []);
            setReports(Array.isArray(reportsData) ? reportsData : []);
            setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
            setAnalyticsData(analyticsStats || null);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
            setPosts([]);
            setFarmers([]);
            setContacts([]);
            setResources([]);
            setConsultations([]);
            setReports([]);
            setTestimonials([]);
            setAnalyticsData(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers for Blog Posts
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                setNewPost({ ...newPost, image: data.url });
                toast.success('Image uploaded');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newPost)
            });

            if (!response.ok) throw new Error('Failed to create post');

            toast.success('Post created successfully');
            setNewPost({
                title: '',
                content: '',
                image: '',
                category: 'General',
                tags: '',
                status: 'published',
                featured: false
            });
            setIsNewPostOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to create post');
        }
    };

    const handleDeletePost = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Post deleted');
                fetchData();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    // Handlers for Resources
    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resourceFile) {
            toast.error("Please select a file");
            return;
        }

        setUploadingResource(true);
        const formData = new FormData();
        formData.append('file', resourceFile);
        formData.append('title', newResource.title);
        formData.append('description', newResource.description);
        formData.append('category', newResource.category);

        try {
            const response = await fetch('/api/resources', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            toast.success('Resource uploaded successfully');
            setNewResource({ title: '', description: '', category: 'Guides' });
            setResourceFile(null);
            setIsNewResourceOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to upload resource');
        } finally {
            setUploadingResource(false);
        }
    };

    const handleDeleteResource = async (id: number) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            const response = await fetch(`/api/resources/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Resource deleted');
                fetchData();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    // Handlers for Farmers and Contacts
    const handleDeleteFarmer = async (id: number) => {
        if (!confirm('Are you sure you want to delete this registration?')) return;
        try {
            const response = await fetch(`/api/farmers/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Registration deleted');
                fetchData();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleDeleteContact = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Message deleted');
                fetchData();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    // Handlers for Testimonials
    const [isNewTestimonialOpen, setIsNewTestimonialOpen] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({
        name: '',
        role: '',
        content: '',
        image: '',
        featured: false
    });
    const [uploadingTestimonialImage, setUploadingTestimonialImage] = useState(false);

    const handleTestimonialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingTestimonialImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                setNewTestimonial({ ...newTestimonial, image: data.url });
                toast.success('Image uploaded');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploadingTestimonialImage(false);
        }
    };

    const handleCreateTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newTestimonial)
            });

            if (!response.ok) throw new Error('Failed to create testimonial');

            toast.success('Testimonial created');
            setNewTestimonial({ name: '', role: '', content: '', image: '', featured: false });
            setIsNewTestimonialOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to create testimonial');
        }
    };

    const handleDeleteTestimonial = async (id: number) => {
        if (!confirm('Delete this testimonial?')) return;
        try {
            const response = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Testimonial deleted');
                fetchData();
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    // Handlers for Farmer Details
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [isFarmerDetailsOpen, setIsFarmerDetailsOpen] = useState(false);
    const [messageText, setMessageText] = useState('');

    const handleViewFarmer = async (farmerId: number) => {
        try {
            const res = await fetch(`/api/admin/farmers/${farmerId}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setSelectedFarmer(data);
                setIsFarmerDetailsOpen(true);
            } else {
                toast.error('Failed to load farmer details');
            }
        } catch (error) {
            toast.error('Error loading details');
        }
    };

    const handleSendMessage = async () => {
        if (!selectedFarmer || !messageText) return;
        try {
            const res = await fetch(`/api/admin/farmers/${selectedFarmer.profile.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageText, type: 'sms' })
            });

            if (res.ok) {
                toast.success('Message sent successfully (Simulation)');
                setMessageText('');
                setIsFarmerDetailsOpen(false);
            }
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen bg-gray-50/50">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage your farmers, posts, and resources.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={logout} className="gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                </Button>
            </div>

            <Tabs defaultValue="analytics" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 max-w-full">
                    <TabsTrigger value="analytics" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Analytics</TabsTrigger>
                    <TabsTrigger value="posts" className="gap-2"><FileText className="h-4 w-4" /> Posts</TabsTrigger>
                    <TabsTrigger value="resources" className="gap-2"><Package className="h-4 w-4" /> Resources</TabsTrigger>
                    <TabsTrigger value="farmers" className="gap-2"><Users className="h-4 w-4" /> Farmers</TabsTrigger>
                    <TabsTrigger value="testimonials" className="gap-2"><MessageSquare className="h-4 w-4" /> Testimonials</TabsTrigger>
                    <TabsTrigger value="consultations" className="gap-2"><MessageSquare className="h-4 w-4" /> Consultations</TabsTrigger>
                    <TabsTrigger value="reports" className="gap-2"><AlertTriangle className="h-4 w-4" /> Reports</TabsTrigger>
                    <TabsTrigger value="contacts" className="gap-2"><MessageSquare className="h-4 w-4" /> Inquiries</TabsTrigger>
                </TabsList>

                {/* ANALYTICS TAB */}
                <TabsContent value="analytics" className="space-y-6">
                    <h2 className="text-2xl font-semibold">Platform Overview</h2>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analyticsData?.farmers?.total || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    +{analyticsData?.farmers?.new || 0} this month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{posts.filter(p => !p.title.includes('Draft')).length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{consultations.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    {consultations.filter(c => c.status === 'pending').length} pending
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Farm Reports</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{reports.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    {reports.filter(r => r.status === 'pending').length} pending
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Web Traffic</CardTitle>
                            <CardDescription>
                                Page views over the last 30 days.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                {analyticsData?.traffic?.length ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analyticsData.traffic}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="day"
                                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip
                                                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="visits"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No traffic data available yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* POSTS TAB */}
                <TabsContent value="posts" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Blog Posts</h2>
                        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Post</DialogTitle>
                                    <DialogDescription>Add a new update or article to the farm blog.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreatePost} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            placeholder="Post title"
                                            value={newPost.title}
                                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Post Image</label>
                                        <div className="flex gap-4 items-center">
                                            {newPost.image && (
                                                <div className="w-20 h-20 rounded border overflow-hidden shrink-0">
                                                    <img src={newPost.image} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                                <p className="text-xs text-muted-foreground mt-1">Direct upload from device</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={newPost.category}
                                                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                            >
                                                <option value="General">General</option>
                                                <option value="Farming Tips">Farming Tips</option>
                                                <option value="Market News">Market News</option>
                                                <option value="Events">Events</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Status</label>
                                            <select
                                                className="w-full p-2 border rounded-md"
                                                value={newPost.status}
                                                onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                                            >
                                                <option value="published">Published</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tags (comma separated)</label>
                                        <Input
                                            placeholder="e.g. maize, irrigation, pest control"
                                            value={newPost.tags}
                                            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={newPost.featured}
                                            onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="featured" className="text-sm font-medium">Featured Post</label>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea
                                            placeholder="Write your content here..."
                                            value={newPost.content}
                                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                            required
                                            rows={8}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploadingImage}>
                                        {uploadingImage ? 'Uploading Image...' : 'Publish Post'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Card key={post.id} className="overflow-hidden group">
                                {post.image && (
                                    <div className="aspect-video overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                )}
                                <CardHeader className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-xs text-muted-foreground mb-3">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* RESOURCES TAB */}
                <TabsContent value="resources" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Resource Library</h2>
                        <Dialog open={isNewResourceOpen} onOpenChange={setIsNewResourceOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Resource</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Upload Technical Guide</DialogTitle>
                                    <DialogDescription>Upload a PDF document for farmers to download.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateResource} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input placeholder="Guide title" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Category</label>
                                        <Input placeholder="e.g. Guides, Manuals" value={newResource.category} onChange={(e) => setNewResource({ ...newResource, category: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">PDF File</label>
                                        <Input type="file" accept="application/pdf" onChange={(e) => setResourceFile(e.target.files?.[0] || null)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea placeholder="Short description of the guide..." value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} rows={3} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploadingResource}>
                                        {uploadingResource ? 'Uploading PDF...' : 'Upload Resource'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6">
                        {resources.map((resource) => (
                            <Card key={resource.id} className="flex flex-row items-center p-4 gap-4">
                                <div className="h-12 w-12 rounded bg-red-50 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{resource.title}</h3>
                                    <p className="text-xs text-muted-foreground">{resource.category} • {new Date(resource.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={resource.fileUrl} download={true} target="_blank" className="flex items-center gap-1"><ImageIcon className="h-4 w-4" /></a>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteResource(resource.id)} className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* FARMERS TAB */}
                <TabsContent value="farmers" className="space-y-6">
                    <h2 className="text-2xl font-semibold">Registered Farmers</h2>
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold">Name</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Phone / Location</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {farmers.map((farmer) => (
                                    <tr key={farmer.id}>
                                        <td className="px-6 py-4 font-medium">{farmer.name}</td>
                                        <td className="px-6 py-4">{farmer.phone} ({farmer.district})</td>
                                        <td className="px-6 py-4 flex gap-3">
                                            <Button variant="outline" size="sm" onClick={() => handleViewFarmer(farmer.id)}>
                                                View Details
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteFarmer(farmer.id)} className="text-red-500">
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Dialog open={isFarmerDetailsOpen} onOpenChange={setIsFarmerDetailsOpen}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Farmer Profile</DialogTitle>
                            </DialogHeader>
                            {selectedFarmer && (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader className="pb-2"><CardTitle className="text-sm">Personal Info</CardTitle></CardHeader>
                                            <CardContent>
                                                <div className="space-y-1 text-sm">
                                                    <p><strong>Name:</strong> {selectedFarmer.profile.name}</p>
                                                    <p><strong>Phone:</strong> {selectedFarmer.profile.phone}</p>
                                                    <p><strong>Location:</strong> {selectedFarmer.profile.district}</p>
                                                    <p><strong>Language:</strong> {selectedFarmer.profile.language}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-muted-foreground mb-2">Send SMS/Notification</p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Message..."
                                                        value={messageText}
                                                        onChange={(e) => setMessageText(e.target.value)}
                                                    />
                                                    <Button size="sm" onClick={handleSendMessage}><MessageSquare className="w-4 h-4" /></Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center gap-2"><LeafIcon className="w-4 h-4" /> Crops & Land</h3>
                                        <div className="grid gap-2">
                                            {selectedFarmer.crops?.length ? selectedFarmer.crops.map((c: any) => (
                                                <div key={c.id} className="p-3 border rounded-lg text-sm bg-gray-50 flex justify-between">
                                                    <span><strong>{c.cropName}</strong> ({c.variety})</span>
                                                    <span>{c.landSize} acres • {c.status}</span>
                                                </div>
                                            )) : <p className="text-muted-foreground text-sm">No crops registered yet.</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Recent Reports</h3>
                                        <div className="grid gap-2">
                                            {selectedFarmer.reports?.length ? selectedFarmer.reports.map((r: any) => (
                                                <div key={r.id} className="p-3 border rounded-lg text-sm bg-gray-50">
                                                    <div className="flex justify-between font-medium mb-1">
                                                        <span>{r.problemType}</span>
                                                        <Badge variant={r.status === 'resolved' ? 'default' : 'outline'}>{r.status}</Badge>
                                                    </div>
                                                    <p className="text-gray-600 line-clamp-1">{r.description}</p>
                                                </div>
                                            )) : <p className="text-muted-foreground text-sm">No reports submitted.</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </TabsContent>
                {/* TESTIMONIALS TAB */}
                <TabsContent value="testimonials" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Testimonials</h2>
                        <Dialog open={isNewTestimonialOpen} onOpenChange={setIsNewTestimonialOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><Plus className="h-4 w-4" /> New Testimonial</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add Testimonial</DialogTitle>
                                    <DialogDescription>Share a success story from a farmer.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateTestimonial} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Farmer Name</label>
                                        <Input
                                            value={newTestimonial.name}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Role / Location</label>
                                        <Input
                                            placeholder="e.g. Maize Farmer, Kasungu"
                                            value={newTestimonial.role}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Photo</label>
                                        <div className="flex gap-4 items-center">
                                            {newTestimonial.image && (
                                                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                                                    <img src={newTestimonial.image} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Input type="file" accept="image/*" onChange={handleTestimonialImageUpload} disabled={uploadingTestimonialImage} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quote</label>
                                        <Textarea
                                            value={newTestimonial.content}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                                            required
                                            rows={4}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="featured_testimonial"
                                            checked={newTestimonial.featured}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, featured: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="featured_testimonial" className="text-sm font-medium">Featured on Home Page</label>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={uploadingTestimonialImage}>
                                        {uploadingTestimonialImage ? 'Uploading...' : 'Save Testimonial'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t) => (
                            <Card key={t.id} className="relative">
                                <CardHeader className="flex flex-row items-center gap-4 py-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                        {t.image ? (
                                            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-primary font-bold text-lg">{t.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{t.name}</CardTitle>
                                        <CardDescription>{t.role}</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(t.id)} className="ml-auto text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm italic text-muted-foreground">"{t.content}"</p>
                                    {t.featured && <Badge variant="secondary" className="mt-2">Featured</Badge>}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* CONSULTATIONS TAB */}
                <TabsContent value="consultations" className="space-y-6">
                    <h2 className="text-2xl font-semibold">Consultation Requests</h2>
                    <div className="grid gap-4">
                        {consultations.map((c) => (
                            <Card key={c.id} className="relative">
                                <CardHeader className="flex flex-row items-center justify-between py-4">
                                    <div>
                                        <CardTitle className="text-lg">{c.subject}</CardTitle>
                                        <CardDescription>From: {c.User?.username} • {new Date(c.createdAt).toLocaleString()}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={c.status === 'resolved' ? 'default' : c.status === 'in-progress' ? 'secondary' : 'outline'}>
                                            {c.status}
                                        </Badge>
                                        <Button size="sm" variant="outline" onClick={() => openResponseDialog(c, 'consultation')}>
                                            Manage
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-4">{c.message}</p>
                                    {c.adminResponse && (
                                        <div className="bg-muted p-3 rounded-lg text-sm mt-2">
                                            <p className="font-semibold text-xs uppercase text-muted-foreground mb-1">Admin Response:</p>
                                            {c.adminResponse}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* REPORTS TAB */}
                <TabsContent value="reports" className="space-y-6">
                    <h2 className="text-2xl font-semibold">Farm Problem Reports</h2>
                    <div className="grid gap-4">
                        {reports.map((r) => (
                            <Card key={r.id}>
                                <CardHeader className="flex flex-row items-center justify-between py-4">
                                    <div>
                                        <CardTitle className="text-lg">{r.problemType}</CardTitle>
                                        <CardDescription>By: {r.User?.username} • {r.location} • {new Date(r.createdAt).toLocaleString()}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={r.status === 'resolved' ? 'default' : r.status === 'in-progress' ? 'secondary' : 'outline'} className={r.status === 'pending' ? 'border-orange-500 text-orange-600' : ''}>
                                            {r.status}
                                        </Badge>
                                        <Button size="sm" variant="outline" onClick={() => openResponseDialog(r, 'report')}>
                                            Manage
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-4">{r.description}</p>
                                    {r.adminResponse && (
                                        <div className="bg-muted p-3 rounded-lg text-sm mt-2">
                                            <p className="font-semibold text-xs uppercase text-muted-foreground mb-1">Admin Response:</p>
                                            {r.adminResponse}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* RESPONSE DIALOG */}
                <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Manage {itemType === 'consultation' ? 'Consultation' : 'Report'}</DialogTitle>
                            <DialogDescription>
                                Update status and provide response to the farmer.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={responseForm.status}
                                    onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Response (Visible to Farmer)</label>
                                <Textarea
                                    value={responseForm.adminResponse}
                                    onChange={(e) => setResponseForm({ ...responseForm, adminResponse: e.target.value })}
                                    rows={4}
                                    placeholder="Type your advice or solution here..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link Resources <span className="text-xs text-muted-foreground">(Hold Ctrl/Cmd to select multiple)</span></label>
                                <select
                                    multiple
                                    className="w-full p-2 border rounded-md h-32"
                                    value={responseForm.linkedResourceIds?.map(String) || []}
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                                        setResponseForm({ ...responseForm, linkedResourceIds: values });
                                    }}
                                >
                                    {resources.map(r => (
                                        <option key={r.id} value={r.id}>{r.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link Blog Posts <span className="text-xs text-muted-foreground">(Hold Ctrl/Cmd to select multiple)</span></label>
                                <select
                                    multiple
                                    className="w-full p-2 border rounded-md h-32"
                                    value={responseForm.linkedPostIds?.map(String) || []}
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                                        setResponseForm({ ...responseForm, linkedPostIds: values });
                                    }}
                                >
                                    {posts.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedItem(null)}>Cancel</Button>
                            <Button onClick={handleUpdateResponse}>Save Changes</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* CONTACTS TAB */}
                <TabsContent value="contacts" className="space-y-6">
                    <h2 className="text-2xl font-semibold">General Inquiries</h2>
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold">Name</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Contact</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Message</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{contact.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div>{contact.email}</div>
                                            <div className="text-muted-foreground">{contact.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm max-w-xs truncate">{contact.message}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)} className="text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;


