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
import { getEmployees, deleteEmployee, createEmployee, updateEmployee, Employee as ApiEmployee } from "@/integrations/api/employees";
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

type Employee = ApiEmployee;

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_code: "",
    full_name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    branch_id: "",
    is_active: true,
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
    loadBranches();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (error: any) {
      toast.error("Failed to load employees");
      console.error(error);
    } finally {
      setLoading(false);
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

  const handleAddEmployee = async () => {
    try {
      await createEmployee(newEmployee);
      toast.success("Employee created successfully");
      setIsAddModalOpen(false);
      loadEmployees();
      // Reset form
      setNewEmployee({
        employee_code: "",
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        branch_id: "",
        is_active: true,
      });
    } catch (error: any) {
      toast.error("Failed to create employee");
      console.error(error);
    }
  };

  const handleEditEmployee = async () => {
    if (!editingEmployee) return;
    
    try {
      await updateEmployee(editingEmployee.id, {
        employee_code: editingEmployee.employee_code,
        full_name: editingEmployee.full_name,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        designation: editingEmployee.designation,
        department: editingEmployee.department,
        branch_id: editingEmployee.branch_id,
        is_active: editingEmployee.is_active,
      });
      toast.success("Employee updated successfully");
      setIsEditModalOpen(false);
      loadEmployees();
      setEditingEmployee(null);
    } catch (error: any) {
      toast.error("Failed to update employee");
      console.error(error);
    }
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const openViewModal = (employee: Employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-2">Manage employee records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-64 transition-all duration-200 hover:shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none w-full transition-all duration-200 hover:shadow-sm">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Employee</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee Code *</label>
                  <Input
                    value={newEmployee.employee_code}
                    onChange={(e) => setNewEmployee({...newEmployee, employee_code: e.target.value})}
                    placeholder="Enter employee code"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    value={newEmployee.full_name}
                    onChange={(e) => setNewEmployee({...newEmployee, full_name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation</label>
                  <Input
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    placeholder="Enter department"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Branch</label>
                  <Select value={newEmployee.branch_id} onValueChange={(value) => setNewEmployee({...newEmployee, branch_id: value})}>
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newEmployee.is_active}
                    onChange={(e) => setNewEmployee({...newEmployee, is_active: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Active Employee
                  </label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>
                    Add Employee
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
            placeholder="Search employees..."
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
                <TableHead className="font-semibold text-foreground">Employee Code</TableHead>
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Email</TableHead>
                <TableHead className="font-semibold text-foreground">Phone</TableHead>
                <TableHead className="font-semibold text-foreground">Designation</TableHead>
                <TableHead className="font-semibold text-foreground">Department</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-secondary/30 transition-all duration-200 hover-lift">
                    <TableCell className="font-medium text-foreground">{employee.employee_code}</TableCell>
                    <TableCell className="text-foreground">{employee.full_name}</TableCell>
                    <TableCell className="text-foreground">{employee.email || "-"}</TableCell>
                    <TableCell className="text-foreground">{employee.phone || "-"}</TableCell>
                    <TableCell className="text-foreground">{employee.designation || "-"}</TableCell>
                    <TableCell className="text-foreground">{employee.department || "-"}</TableCell>
                    <TableCell>
                      <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${employee.is_active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {employee.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openViewModal(employee)}
                        >
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift"
                          onClick={() => openEditModal(employee)}
                        >
                          <Edit className="h-4 w-4 text-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover-lift"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this employee?")) {
                              try {
                                await deleteEmployee(employee.id);
                                // Refresh the employee list
                                loadEmployees();
                                toast.success("Employee deleted successfully");
                              } catch (error) {
                                toast.error("Failed to delete employee");
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
              Showing <span className="font-medium text-foreground">{filteredEmployees.length}</span> of <span className="font-medium text-foreground">{employees.length}</span> employees
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

      {/* View Employee Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {viewingEmployee && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Employee Code</p>
                  <p className="font-medium">{viewingEmployee.employee_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${viewingEmployee.is_active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {viewingEmployee.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {viewingEmployee.created_at 
                      ? new Date(viewingEmployee.created_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {viewingEmployee.updated_at 
                      ? new Date(viewingEmployee.updated_at).toLocaleDateString() 
                      : "Not available"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{viewingEmployee.full_name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{viewingEmployee.email || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{viewingEmployee.phone || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium">{viewingEmployee.designation || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{viewingEmployee.department || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Branch</p>
                <p className="font-medium">
                  {viewingEmployee.Branch?.name || viewingEmployee.branch_id || "Not assigned"}
                </p>
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

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee Code *</label>
                <Input
                  value={editingEmployee.employee_code}
                  onChange={(e) => setEditingEmployee({...editingEmployee, employee_code: e.target.value})}
                  placeholder="Enter employee code"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={editingEmployee.full_name}
                  onChange={(e) => setEditingEmployee({...editingEmployee, full_name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editingEmployee.email || ""}
                  onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editingEmployee.phone || ""}
                  onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <Input
                  value={editingEmployee.designation || ""}
                  onChange={(e) => setEditingEmployee({...editingEmployee, designation: e.target.value})}
                  placeholder="Enter designation"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={editingEmployee.department || ""}
                  onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={editingEmployee.branch_id || ""} onValueChange={(value) => setEditingEmployee({...editingEmployee, branch_id: value})}>
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={editingEmployee.is_active}
                  onChange={(e) => setEditingEmployee({...editingEmployee, is_active: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="edit_is_active" className="text-sm font-medium">
                  Active Employee
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditEmployee}>
                  Update Employee
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;