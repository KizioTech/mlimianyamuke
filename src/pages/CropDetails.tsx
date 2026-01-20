import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Trash2, Plus } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: string;
    priority: string;
}

interface Crop {
    id: number;
    cropName: string;
    variety: string;
    plantingDate: string;
    expectedHarvestDate: string;
    landSize: string;
    location: string;
    status: string;
    notes: string;
    FarmTasks?: Task[];
}

const CropDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [crop, setCrop] = useState<Crop | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
    });

    const fetchCropDetails = async () => {
        try {
            // Fetch crop info (we could optimize to get both in one call or use the previous improved controller)
            // Assuming getUserCrops returns tasks or we fetch separately. 
            // Better to have a getCropById endpoint. I didn't create one explicitly in routes, but I can add it or filter from all.
            // Wait, I didn't add getCropById in routes. I added getUserCrops.
            // I should use the one I added: `router.get('/crops/:id', authenticate, cropController.getCropById)`?
            // Checking cropRoutes.js content:
            // router.get('/crops', ... getUserCrops)
            // router.put('/crops/:id', ... updateCrop)
            // router.delete('/crops/:id', ... deleteCrop)
            // MISSING GET SINGLE CROP!
            // I will implement a workaround by fetching all and filtering for now, or add the endpoint.
            // Adding the endpoint is better.

            // Temporary workaround: Fetch all crops and find the one.
            const res = await fetch('/api/farm/crops', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const crops: Crop[] = await res.json();
                const foundCrop = crops.find(c => c.id === Number(id));
                if (foundCrop) {
                    setCrop(foundCrop);
                    setTasks(foundCrop.FarmTasks || []);
                } else {
                    toast.error('Crop not found');
                    navigate('/my-farm');
                }
            }
        } catch (error) {
            toast.error("Failed to load crop details");
        }
    };

    useEffect(() => {
        if (id && token) fetchCropDetails();
    }, [id, token]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/farm/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...newTask, CropId: Number(id) })
            });

            if (res.ok) {
                toast.success('Task added');
                setIsNewTaskOpen(false);
                setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
                fetchCropDetails();
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            toast.error('Failed to add task');
        }
    };

    const handleToggleTask = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            const res = await fetch(`/api/farm/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchCropDetails();
            }
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm('Delete this task?')) return;
        try {
            await fetch(`/api/farm/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCropDetails();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (!crop) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen bg-gray-50/50">
            <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate('/my-farm')}>
                <ArrowLeft className="h-4 w-4" /> Back to My Farm
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Crop Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-2xl">{crop.cropName}</CardTitle>
                        <CardDescription>{crop.variety}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="outline">{crop.status}</Badge>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Planted</span>
                            <span>{crop.plantingDate}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Harvest</span>
                            <span>{crop.expectedHarvestDate}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Area</span>
                            <span>{crop.landSize}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Location</span>
                            <span>{crop.location}</span>
                        </div>
                        {crop.notes && (
                            <div className="pt-2">
                                <span className="text-muted-foreground text-sm block mb-1">Notes</span>
                                <p className="text-sm bg-muted p-2 rounded">{crop.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tasks */}
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Farm Tasks</CardTitle>
                        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Task</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Task for {crop.cropName}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Task Title</label>
                                        <Input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required placeholder="e.g. Apply Fertilizer" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Due Date</label>
                                        <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Priority</label>
                                        <select className="w-full p-2 border rounded-md" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} rows={3} />
                                    </div>
                                    <Button type="submit" className="w-full">Save Task</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No tasks scheduled yet.</p>
                            ) : (
                                tasks.map(task => (
                                    <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.status === 'completed' ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                                        <button onClick={() => handleToggleTask(task)} className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-primary'}`}>
                                            {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                        </button>
                                        <div className="flex-1">
                                            <h4 className={`font-medium ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-1">{task.description}</p>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className={`px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                                                    {task.priority}
                                                </span>
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Clock className="h-3 w-3" /> Due {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500" onClick={() => handleDeleteTask(task.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CropDetails;
