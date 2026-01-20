import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Sprout, Plus, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    FarmTasks?: any[];
}

const FarmerCropDashboard: React.FC = () => {
    const { token } = useAuth();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [isNewCropOpen, setIsNewCropOpen] = useState(false);
    const [newCrop, setNewCrop] = useState({
        cropName: '',
        variety: '',
        plantingDate: '',
        expectedHarvestDate: '',
        landSize: '',
        location: '',
        notes: ''
    });

    const fetchCrops = async () => {
        try {
            const res = await fetch('/api/farm/crops', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCrops(data);
            }
        } catch (error) {
            toast.error("Failed to load crops");
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    const handleCreateCrop = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/farm/crops', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newCrop)
            });

            if (res.ok) {
                toast.success('Crop added successfully');
                setIsNewCropOpen(false);
                setNewCrop({
                    cropName: '', variety: '', plantingDate: '',
                    expectedHarvestDate: '', landSize: '', location: '', notes: ''
                });
                fetchCrops();
            } else {
                throw new Error('Failed to add crop');
            }
        } catch (error) {
            toast.error('Failed to add crop');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'planning': return 'bg-blue-100 text-blue-800';
            case 'planted': return 'bg-green-100 text-green-800';
            case 'growing': return 'bg-emerald-100 text-emerald-800';
            case 'harvesting': return 'bg-orange-100 text-orange-800';
            case 'harvested': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen bg-gray-50/50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Farm</h1>
                    <p className="text-muted-foreground">Manage your crops and farming activities.</p>
                </div>
                <Dialog open={isNewCropOpen} onOpenChange={setIsNewCropOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="h-4 w-4" /> Add New Crop</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Crop</DialogTitle>
                            <DialogDescription>Enter details about your new planting.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateCrop} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Crop Name</label>
                                    <Input placeholder="e.g. Maize" value={newCrop.cropName} onChange={e => setNewCrop({ ...newCrop, cropName: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Variety</label>
                                    <Input placeholder="e.g. Hybrid 614" value={newCrop.variety} onChange={e => setNewCrop({ ...newCrop, variety: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Planting Date</label>
                                    <Input type="date" value={newCrop.plantingDate} onChange={e => setNewCrop({ ...newCrop, plantingDate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Expected Harvest</label>
                                    <Input type="date" value={newCrop.expectedHarvestDate} onChange={e => setNewCrop({ ...newCrop, expectedHarvestDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Land Size</label>
                                    <Input placeholder="e.g. 2 acres" value={newCrop.landSize} onChange={e => setNewCrop({ ...newCrop, landSize: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <Input placeholder="e.g. Lower Field" value={newCrop.location} onChange={e => setNewCrop({ ...newCrop, location: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea placeholder="Any additional details..." value={newCrop.notes} onChange={e => setNewCrop({ ...newCrop, notes: e.target.value })} rows={3} />
                            </div>
                            <Button type="submit" className="w-full">Create Crop</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {crops.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
                        <Sprout className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No crops added yet</h3>
                        <p className="text-sm text-gray-500 mt-1">Start by adding your first crop to track its progress.</p>
                        <Button className="mt-4 gap-2" variant="outline" onClick={() => setIsNewCropOpen(true)}>
                            <Plus className="h-4 w-4" /> Add Crop
                        </Button>
                    </div>
                ) : (
                    crops.map(crop => (
                        <Card key={crop.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            {crop.cropName}
                                            <Badge variant="secondary" className={getStatusColor(crop.status)}>
                                                {crop.status || 'Planned'}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>{crop.variety}</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link to={`/my-farm/crop/${crop.id}`}><ArrowRight className="h-5 w-5" /></Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Planted: {crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{crop.location} • {crop.landSize}</span>
                                    </div>
                                    {crop.expectedHarvestDate && (
                                        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-center font-medium text-xs">
                                            Expected Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default FarmerCropDashboard;
