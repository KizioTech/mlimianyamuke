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
import { Plus, Trash2, Edit, Users, MessageSquare, LayoutDashboard, LogOut, Package, FileText, Upload, Image as ImageIcon, AlertTriangle } from 'lucide-react';

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

const Dashboard: React.FC = () => {
    const { token, logout } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [reports, setReports] = useState<FarmReport[]>([]);

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

            const [postsRes, farmersRes, contactsRes, resourcesRes, consultsRes, reportsRes] = await Promise.all([
                fetch('/api/posts', { headers }),
                fetch('/api/farmers', { headers }),
                fetch('/api/contacts', { headers }),
                fetch('/api/resources', { headers }),
                fetch('/api/interactions/consultations/all', { headers }),
                fetch('/api/interactions/reports/all', { headers })
            ]);

            const [postsData, farmersData, contactsData, resourcesData, consultsData, reportsData] = await Promise.all([
                postsRes.json(),
                farmersRes.json(),
                contactsRes.json(),
                resourcesRes.json(),
                consultsRes.json(),
                reportsRes.json()
            ]);

            console.log('Fetched data:', {
                posts: postsData,
                farmers: farmersData,
                contacts: contactsData,
                resources: resourcesData,
                consultations: consultsData,
                reports: reportsData
            });

            // Set data with fallbacks to empty arrays if data is invalid
            setPosts(Array.isArray(postsData) ? postsData : []);
            setFarmers(Array.isArray(farmersData) ? farmersData : []);
            setContacts(Array.isArray(contactsData) ? contactsData : []);
            setResources(Array.isArray(resourcesData) ? resourcesData : []);
            setConsultations(Array.isArray(consultsData) ? consultsData : []);
            setReports(Array.isArray(reportsData) ? reportsData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
            // Set empty arrays on error to prevent map() errors
            setPosts([]);
            setFarmers([]);
            setContacts([]);
            setResources([]);
            setConsultations([]);
            setReports([]);
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

            <Tabs defaultValue="posts" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 max-w-full">
                    <TabsTrigger value="posts" className="gap-2"><FileText className="h-4 w-4" /> Posts</TabsTrigger>
                    <TabsTrigger value="resources" className="gap-2"><Package className="h-4 w-4" /> Resources</TabsTrigger>
                    <TabsTrigger value="farmers" className="gap-2"><Users className="h-4 w-4" /> Farmers</TabsTrigger>
                    <TabsTrigger value="consultations" className="gap-2"><MessageSquare className="h-4 w-4" /> Consultations</TabsTrigger>
                    <TabsTrigger value="reports" className="gap-2"><AlertTriangle className="h-4 w-4" /> Reports</TabsTrigger>
                    <TabsTrigger value="contacts" className="gap-2"><MessageSquare className="h-4 w-4" /> Inquiries</TabsTrigger>
                </TabsList>

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
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Registered Farmers</h2>
                    </div>
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {farmers.map((farmer) => (
                                    <tr key={farmer.id}>
                                        <td className="px-6 py-4 font-medium">{farmer.name}</td>
                                        <td className="px-6 py-4">{farmer.phone} ({farmer.district})</td>
                                        <td className="px-6 py-4 text-red-500 cursor-pointer" onClick={() => handleDeleteFarmer(farmer.id)}>Delete</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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


