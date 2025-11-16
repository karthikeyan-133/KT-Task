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
import { getCategories, deleteCategory, createCategory, updateCategory, AssetCategory } from "@/integrations/api/categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Categories = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<AssetCategory | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Failed to load categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      await createCategory(newCategory);
      toast.success("Category created successfully");
      setIsAddModalOpen(false);
      loadCategories();
      // Reset form
      setNewCategory({
        name: "",
        description: "",
      });
    } catch (error: any) {
      toast.error("Failed to create category");
      console.error(error);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;
    
    try {
      await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
      });
      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      loadCategories();
      setEditingCategory(null);
    } catch (error: any) {
      toast.error("Failed to update category");
      console.error(error);
    }
  };

  const openEditModal = (category: AssetCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const openViewModal = (category: AssetCategory) => {
    setViewingCategory(category);
    setIsViewModalOpen(true);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-3xl font-bold text-foreground">Asset Categories</h1>
          <p className="text-muted-foreground mt-2">Manage asset categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
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
                <span>Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>
                    Add Category
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
                <TableHead className="font-semibold text-foreground">Description</TableHead>
                <TableHead className="font-semibold text-foreground">Assets Count</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-secondary/30 transition-all duration-200 hover-lift">
                    <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                    <TableCell className="text-foreground">{category.description || "-"}</TableCell>
                    <TableCell className="text-foreground">0</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openViewModal(category)}
                        >
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openEditModal(category)}
                        >
                          <Edit className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover-lift"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this category?")) {
                              try {
                                await deleteCategory(category.id);
                                // Refresh the category list
                                loadCategories();
                                toast.success("Category deleted successfully");
                              } catch (error) {
                                toast.error("Failed to delete category");
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
              Showing <span className="font-medium text-foreground">{filteredCategories.length}</span> of <span className="font-medium text-foreground">{categories.length}</span> categories
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

      {/* View Category Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
          </DialogHeader>
          {viewingCategory && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{viewingCategory.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {viewingCategory.created_at 
                      ? new Date(viewingCategory.created_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {viewingCategory.updated_at 
                      ? new Date(viewingCategory.updated_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{viewingCategory.description || "No description provided"}</p>
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

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCategory}>
                  Update Category
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;