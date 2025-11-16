import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getBranches, deleteBranch, createBranch, updateBranch, Branch } from "@/integrations/api/branches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
  });
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data || []);
    } catch (error: any) {
      toast.error("Failed to load branches");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = async () => {
    try {
      await createBranch(newBranch);
      toast.success("Branch created successfully");
      setIsAddModalOpen(false);
      loadBranches();
      // Reset form
      setNewBranch({
        name: "",
        location: "",
      });
    } catch (error: any) {
      toast.error("Failed to create branch");
      console.error(error);
    }
  };

  const handleEditBranch = async () => {
    if (!editingBranch) return;
    
    try {
      await updateBranch(editingBranch.id, {
        name: editingBranch.name,
        location: editingBranch.location,
      });
      toast.success("Branch updated successfully");
      setIsEditModalOpen(false);
      loadBranches();
      setEditingBranch(null);
    } catch (error: any) {
      toast.error("Failed to update branch");
      console.error(error);
    }
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setIsEditModalOpen(true);
  };

  const openViewModal = (branch: Branch) => {
    setViewingBranch(branch);
    setIsViewModalOpen(true);
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.location && branch.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Branches</h1>
          <p className="text-muted-foreground mt-2">Manage company branches</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-64 transition-all duration-200 hover:shadow-sm"
            />
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Branch</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                    placeholder="Enter branch name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={newBranch.location}
                    onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
                    placeholder="Enter location"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBranch}>
                    Add Branch
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border-0 shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Location</TableHead>
                <TableHead className="font-semibold text-foreground">Assets Count</TableHead>
                <TableHead className="font-semibold text-foreground">Employees Count</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No branches found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((branch) => (
                  <TableRow key={branch.id} className="hover:bg-secondary/30 transition-all duration-200 hover-lift">
                    <TableCell className="font-medium text-foreground">{branch.name}</TableCell>
                    <TableCell className="text-foreground">{branch.location || "-"}</TableCell>
                    <TableCell className="text-foreground">0</TableCell>
                    <TableCell className="text-foreground">0</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openViewModal(branch)}
                        >
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openEditModal(branch)}
                        >
                          <Edit className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover-lift"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this branch?")) {
                              try {
                                await deleteBranch(branch.id);
                                // Refresh the branch list
                                loadBranches();
                                toast.success("Branch deleted successfully");
                              } catch (error) {
                                toast.error("Failed to delete branch");
                                console.error(error);
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-4 border-t border-border bg-secondary/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredBranches.length}</span> of <span className="font-medium text-foreground">{branches.length}</span> branches
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover-lift">
                Previous
              </button>
              <button className="px-3 py-1 text-sm rounded-lg bg-primary text-primary-foreground transition-all duration-200 hover-lift">
                1
              </button>
              <button className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover-lift">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Branch Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Branch Details</DialogTitle>
          </DialogHeader>
          {viewingBranch && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{viewingBranch.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {viewingBranch.created_at 
                      ? new Date(viewingBranch.created_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {viewingBranch.updated_at 
                      ? new Date(viewingBranch.updated_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{viewingBranch.location || "Not specified"}</p>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Branch Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          {editingBranch && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({...editingBranch, name: e.target.value})}
                  placeholder="Enter branch name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editingBranch.location || ""}
                  onChange={(e) => setEditingBranch({...editingBranch, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBranch}>
                  Update Branch
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;