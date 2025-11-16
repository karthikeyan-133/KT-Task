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
import { getTransactions, AssetTransaction, issueAsset, returnAsset, scrapAsset } from "@/integrations/api/transactions";
import { getAssets, Asset as ApiAsset } from "@/integrations/api/assets";
import { getEmployees, Employee as ApiEmployee } from "@/integrations/api/employees";
import { getBranches, Branch } from "@/integrations/api/branches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Transactions = () => {
  const [transactions, setTransactions] = useState<AssetTransaction[]>([]);
  const [assets, setAssets] = useState<ApiAsset[]>([]);
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"issue" | "return" | "scrap">("issue");
  const [selectedTransaction, setSelectedTransaction] = useState<AssetTransaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    asset_id: "",
    employee_id: "",
    branch_id: "",
    notes: "",
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data || []);
    } catch (error: any) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      const data = await getAssets();
      setAssets(data || []);
    } catch (error: any) {
      toast.error("Failed to load assets");
      console.error(error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (error: any) {
      toast.error("Failed to load employees");
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

  const openNewTransactionModal = async () => {
    // Load all required data
    await Promise.all([
      loadAssets(),
      loadEmployees(),
      loadBranches()
    ]);
    setIsNewTransactionModalOpen(true);
  };

  const handleCreateTransaction = async () => {
    try {
      switch (transactionType) {
        case "issue":
          if (!newTransaction.asset_id || !newTransaction.employee_id || !newTransaction.branch_id) {
            toast.error("Please fill in all required fields");
            return;
          }
          await issueAsset({
            asset_id: newTransaction.asset_id,
            employee_id: newTransaction.employee_id,
            branch_id: newTransaction.branch_id,
            notes: newTransaction.notes || undefined,
          });
          break;
        case "return":
          if (!newTransaction.asset_id) {
            toast.error("Please select an asset");
            return;
          }
          await returnAsset({
            asset_id: newTransaction.asset_id,
            notes: newTransaction.notes || undefined,
          });
          break;
        case "scrap":
          if (!newTransaction.asset_id) {
            toast.error("Please select an asset");
            return;
          }
          await scrapAsset({
            asset_id: newTransaction.asset_id,
            notes: newTransaction.notes || undefined,
          });
          break;
      }
      
      toast.success("Transaction created successfully");
      setIsNewTransactionModalOpen(false);
      loadTransactions();
      
      // Reset form
      setNewTransaction({
        asset_id: "",
        employee_id: "",
        branch_id: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error("Failed to create transaction");
      console.error(error);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.Asset && transaction.Asset.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.Employee && transaction.Employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "issue":
        return "bg-primary/10 text-primary";
      case "return":
        return "bg-warning/10 text-warning";
      case "scrap":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  const openViewModal = (transaction: AssetTransaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
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
          <h1 className="text-3xl font-bold text-foreground">Asset Transactions</h1>
          <p className="text-muted-foreground mt-2">Manage asset transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-64 transition-all duration-200 hover:shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none w-full transition-all duration-200 hover:shadow-sm">
              <option>All Types</option>
              <option>Issue</option>
              <option>Return</option>
              <option>Scrap</option>
            </select>
          </div>
          <Button 
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={openNewTransactionModal}
          >
            <Plus className="h-4 w-4" />
            <span>New Transaction</span>
          </Button>
        </div>
      </div>

      <div className="border-0 shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="font-semibold text-foreground">Transaction ID</TableHead>
                <TableHead className="font-semibold text-foreground">Asset</TableHead>
                <TableHead className="font-semibold text-foreground">Employee</TableHead>
                <TableHead className="font-semibold text-foreground">Type</TableHead>
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground">Reason</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-secondary/30 transition-all duration-200 hover-lift">
                    <TableCell className="font-medium text-foreground">{transaction.id.substring(0, 8)}</TableCell>
                    <TableCell className="text-foreground">
                      {transaction.Asset ? `${transaction.Asset.name} (${transaction.Asset.asset_code})` : "-"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {transaction.Employee ? transaction.Employee.full_name : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-foreground">{transaction.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openViewModal(transaction)}
                        >
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-secondary/50 cursor-not-allowed transition-all duration-200"
                          title="Transactions cannot be edited"
                          disabled
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-destructive/10 cursor-not-allowed transition-all duration-200"
                          title="Transactions cannot be deleted"
                          disabled
                        >
                          <Trash2 className="h-4 w-4 text-destructive/50" />
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
              Showing <span className="font-medium text-foreground">{filteredTransactions.length}</span> of <span className="font-medium text-foreground">{transactions.length}</span> transactions
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

      {/* View Transaction Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(selectedTransaction.transaction_type)}`}>
                    {selectedTransaction.transaction_type.charAt(0).toUpperCase() + selectedTransaction.transaction_type.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedTransaction.transaction_date).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Asset</p>
                <p className="font-medium">
                  {selectedTransaction.Asset 
                    ? `${selectedTransaction.Asset.name} (${selectedTransaction.Asset.asset_code})` 
                    : "Not available"}
                </p>
              </div>
              
              {selectedTransaction.Employee && (
                <div>
                  <p className="text-sm text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedTransaction.Employee.full_name}</p>
                </div>
              )}
              
              {selectedTransaction.Branch && (
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-medium">{selectedTransaction.Branch.name}</p>
                </div>
              )}
              
              {selectedTransaction.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedTransaction.notes}</p>
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

      {/* New Transaction Modal */}
      <Dialog open={isNewTransactionModalOpen} onOpenChange={setIsNewTransactionModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select value={transactionType} onValueChange={(value: "issue" | "return" | "scrap") => setTransactionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue">Issue Asset</SelectItem>
                  <SelectItem value="return">Return Asset</SelectItem>
                  <SelectItem value="scrap">Scrap Asset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset *</label>
              <Select 
                value={newTransaction.asset_id} 
                onValueChange={(value) => setNewTransaction({...newTransaction, asset_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.asset_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {transactionType === "issue" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee *</label>
                  <Select 
                    value={newTransaction.employee_id} 
                    onValueChange={(value) => setNewTransaction({...newTransaction, employee_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch *</label>
                  <Select 
                    value={newTransaction.branch_id} 
                    onValueChange={(value) => setNewTransaction({...newTransaction, branch_id: value})}
                  >
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
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                placeholder="Enter notes/reason"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsNewTransactionModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTransaction}>
                Create Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;