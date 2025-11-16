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
import { getAssets, deleteAsset, createAsset, updateAsset, Asset as ApiAsset } from "@/integrations/api/assets";
import { getCategories, AssetCategory } from "@/integrations/api/categories";
import { getBranches, Branch } from "@/integrations/api/branches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Asset = ApiAsset;

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    asset_code: "",
    name: "",
    category_id: "",
    branch_id: "",
    purchase_date: "",
    purchase_value: "",
    current_value: "",
    status: "stock" as "stock" | "issued" | "scrapped",
    specifications: "",
  });
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    loadAssets();
    loadCategories();
    loadBranches();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data || []);
    } catch (error: any) {
      toast.error("Failed to load assets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Failed to load categories");
      console.error(error);
    }
  };

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data || []);
    } catch (error: any) {
      toast.error("Failed to load branches");
      console.error(error);
    }
  };

  const handleAddAsset = async () => {
    try {
      const assetData: any = {
        asset_code: newAsset.asset_code,
        name: newAsset.name,
        category_id: newAsset.category_id,
        branch_id: newAsset.branch_id,
        purchase_date: newAsset.purchase_date || null,
        status: newAsset.status,
        specifications: newAsset.specifications || null,
      };
      
      // Only add numeric values if they're not empty
      if (newAsset.purchase_value) {
        assetData.purchase_value = parseFloat(newAsset.purchase_value);
      }
      if (newAsset.current_value) {
        assetData.current_value = parseFloat(newAsset.current_value);
      }
      
      await createAsset(assetData);
      toast.success("Asset created successfully");
      setIsAddModalOpen(false);
      loadAssets();
      // Reset form
      setNewAsset({
        asset_code: "",
        name: "",
        category_id: "",
        branch_id: "",
        purchase_date: "",
        purchase_value: "",
        current_value: "",
        status: "stock",
        specifications: "",
      });
    } catch (error: any) {
      toast.error("Failed to create asset");
      console.error(error);
    }
  };

  const handleEditAsset = async () => {
    if (!editingAsset) return;
    
    try {
      const assetData = {
        asset_code: editingAsset.asset_code,
        name: editingAsset.name,
        category_id: editingAsset.category_id,
        branch_id: editingAsset.branch_id,
        purchase_date: editingAsset.purchase_date,
        purchase_value: editingAsset.purchase_value,
        current_value: editingAsset.current_value,
        status: editingAsset.status,
        specifications: editingAsset.specifications,
      };
      await updateAsset(editingAsset.id, assetData);
      toast.success("Asset updated successfully");
      setIsEditModalOpen(false);
      loadAssets();
      setEditingAsset(null);
    } catch (error: any) {
      toast.error("Failed to update asset");
      console.error(error);
    }
  };

  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditModalOpen(true);
  };

  const openViewModal = (asset: Asset) => {
    setViewingAsset(asset);
    setIsViewModalOpen(true);
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stock":
        return "bg-success/10 text-success";
      case "issued":
        return "bg-primary/10 text-primary";
      case "scrapped":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground mt-2">Manage asset inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-64 transition-all duration-200 hover:shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none w-full transition-all duration-200 hover:shadow-sm">
              <option>All Statuses</option>
              <option>Stock</option>
              <option>Issued</option>
              <option>Scrapped</option>
            </select>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Asset</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Code *</label>
                  <Input
                    value={newAsset.asset_code}
                    onChange={(e) => setNewAsset({...newAsset, asset_code: e.target.value})}
                    placeholder="Enter asset code"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                    placeholder="Enter asset name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={newAsset.category_id} onValueChange={(value) => setNewAsset({...newAsset, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch *</label>
                  <Select value={newAsset.branch_id} onValueChange={(value) => setNewAsset({...newAsset, branch_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purchase Date</label>
                  <Input
                    type="date"
                    value={newAsset.purchase_date}
                    onChange={(e) => setNewAsset({...newAsset, purchase_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purchase Value</label>
                  <Input
                    type="number"
                    value={newAsset.purchase_value}
                    onChange={(e) => setNewAsset({...newAsset, purchase_value: e.target.value})}
                    placeholder="Enter purchase value"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Value</label>
                  <Input
                    type="number"
                    value={newAsset.current_value}
                    onChange={(e) => setNewAsset({...newAsset, current_value: e.target.value})}
                    placeholder="Enter current value"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={newAsset.status} onValueChange={(value: "stock" | "issued" | "scrapped") => setNewAsset({...newAsset, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                      <SelectItem value="scrapped">Scrapped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specifications</label>
                  <Input
                    value={newAsset.specifications}
                    onChange={(e) => setNewAsset({...newAsset, specifications: e.target.value})}
                    placeholder="Enter specifications"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAsset}>
                    Add Asset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border-0 shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold text-foreground">Asset Code</TableHead>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Category</TableHead>
                <TableHead className="font-semibold text-foreground">Branch</TableHead>
                <TableHead className="font-semibold text-foreground">Purchase Value</TableHead>
                <TableHead className="font-semibold text-foreground">Current Value</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No assets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-secondary/30 transition-all duration-200 hover-lift">
                    <TableCell className="font-medium text-foreground">{asset.asset_code}</TableCell>
                    <TableCell className="text-foreground">{asset.name}</TableCell>
                    <TableCell className="text-foreground">{asset.AssetCategory?.name || "-"}</TableCell>
                    <TableCell className="text-foreground">{asset.Branch?.name || "-"}</TableCell>
                    <TableCell className="text-foreground">
                      ${asset.purchase_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      ${asset.current_value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openViewModal(asset)}
                        >
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openEditModal(asset)}
                        >
                          <Edit className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover-lift"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this asset?")) {
                              try {
                                await deleteAsset(asset.id);
                                // Refresh the asset list
                                loadAssets();
                                toast.success("Asset deleted successfully");
                              } catch (error) {
                                toast.error("Failed to delete asset");
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
              Showing <span className="font-medium text-foreground">{filteredAssets.length}</span> of <span className="font-medium text-foreground">{assets.length}</span> assets
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover-lift">
                Previous
              </button>
              <button className="px-3 py-1 text-sm rounded-lg bg-primary text-primary-foreground transition-all duration-200 hover-lift">
                1
              </button>
              <button className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover-lift">
                2
              </button>
              <button className="px-3 py-1 text-sm rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover-lift">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Asset Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {viewingAsset && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Asset Code</p>
                  <p className="font-medium">{viewingAsset.asset_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingAsset.status)}`}>
                    {viewingAsset.status.charAt(0).toUpperCase() + viewingAsset.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {viewingAsset.created_at 
                      ? new Date(viewingAsset.created_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {viewingAsset.updated_at 
                      ? new Date(viewingAsset.updated_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{viewingAsset.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{viewingAsset.AssetCategory?.name || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">{viewingAsset.Branch?.name || "Not assigned"}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">
                    {viewingAsset.purchase_date 
                      ? new Date(viewingAsset.purchase_date).toLocaleDateString() 
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Value</p>
                  <p className="font-medium">
                    {viewingAsset.purchase_value !== null 
                      ? `$${viewingAsset.purchase_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium">
                    {viewingAsset.current_value !== null 
                      ? `$${viewingAsset.current_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Specifications</p>
                <p className="font-medium">{viewingAsset.specifications || "Not provided"}</p>
              </div>
              
              {viewingAsset.status === "issued" && viewingAsset.Employee && (
                <div>
                  <p className="text-sm text-muted-foreground">Issued To</p>
                  <p className="font-medium">{viewingAsset.Employee.full_name}</p>
                </div>
              )}
              
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

      {/* Edit Asset Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Code *</label>
                <Input
                  value={editingAsset.asset_code}
                  onChange={(e) => setEditingAsset({...editingAsset, asset_code: e.target.value})}
                  placeholder="Enter asset code"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                  placeholder="Enter asset name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Select value={editingAsset.category_id} onValueChange={(value) => setEditingAsset({...editingAsset, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch *</label>
                <Select value={editingAsset.branch_id} onValueChange={(value) => setEditingAsset({...editingAsset, branch_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Date</label>
                <Input
                  type="date"
                  value={editingAsset.purchase_date || ""}
                  onChange={(e) => setEditingAsset({...editingAsset, purchase_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Value</label>
                <Input
                  type="number"
                  value={editingAsset.purchase_value || ""}
                  onChange={(e) => setEditingAsset({...editingAsset, purchase_value: e.target.value ? parseFloat(e.target.value) : null})}
                  placeholder="Enter purchase value"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Value</label>
                <Input
                  type="number"
                  value={editingAsset.current_value || ""}
                  onChange={(e) => setEditingAsset({...editingAsset, current_value: e.target.value ? parseFloat(e.target.value) : null})}
                  placeholder="Enter current value"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={editingAsset.status} onValueChange={(value: "stock" | "issued" | "scrapped") => setEditingAsset({...editingAsset, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="issued">Issued</SelectItem>
                    <SelectItem value="scrapped">Scrapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specifications</label>
                <Input
                  value={editingAsset.specifications || ""}
                  onChange={(e) => setEditingAsset({...editingAsset, specifications: e.target.value})}
                  placeholder="Enter specifications"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditAsset}>
                  Update Asset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;