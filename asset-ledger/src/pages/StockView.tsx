import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import apiClient from "@/integrations/api/client";
import { Search, Filter, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockData {
  branch_name: string;
  total_assets: number;
  stock_assets: number;
  issued_assets: number;
  total_value: number;
}

const StockView = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    total_assets: 0,
    stock_assets: 0,
    issued_assets: 0,
    total_value: 0,
  });

  useEffect(() => {
    loadStockView();
  }, []);

  const loadStockView = async () => {
    try {
      // For now, we'll simulate the stock view data
      // In a real implementation, you would create an endpoint in your Express app
      // that returns this aggregated data
      const simulatedData = [
        {
          branch_name: "Main Office",
          total_assets: 45,
          stock_assets: 28,
          issued_assets: 17,
          total_value: 125450.00,
        },
        {
          branch_name: "Downtown Branch",
          total_assets: 22,
          stock_assets: 15,
          issued_assets: 7,
          total_value: 68900.00,
        },
        {
          branch_name: "Uptown Branch",
          total_assets: 18,
          stock_assets: 12,
          issued_assets: 6,
          total_value: 42300.00,
        },
        {
          branch_name: "Westside Branch",
          total_assets: 32,
          stock_assets: 20,
          issued_assets: 12,
          total_value: 87650.00,
        },
      ];

      setStockData(simulatedData);

      const totals = simulatedData.reduce(
        (acc, curr) => ({
          total_assets: acc.total_assets + curr.total_assets,
          stock_assets: acc.stock_assets + curr.stock_assets,
          issued_assets: acc.issued_assets + curr.issued_assets,
          total_value: acc.total_value + curr.total_value,
        }),
        { total_assets: 0, stock_assets: 0, issued_assets: 0, total_value: 0 }
      );
      setTotals(totals);
    } catch (error: any) {
      toast.error("Failed to load stock view");
      console.error(error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-foreground">Stock View</h1>
          <p className="text-muted-foreground mt-2">Asset distribution by branch</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search branches..." 
              className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-64 transition-all duration-200 hover:shadow-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select className="pl-10 pr-8 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none w-full transition-all duration-200 hover:shadow-sm">
              <option>All Branches</option>
              <option>Main Office</option>
              <option>Downtown Branch</option>
              <option>Uptown Branch</option>
              <option>Westside Branch</option>
            </select>
          </div>
          <Button className="flex items-center gap-2 whitespace-nowrap">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg rounded-xl hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Assets</span>
              <div className="p-2 rounded-lg bg-primary/10">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{totals.total_assets}</div>
            <p className="text-xs text-success font-medium flex items-center">
              <span>↑ 12% from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-xl hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>In Stock</span>
              <div className="p-2 rounded-lg bg-success/10">
                <div className="h-2 w-2 rounded-full bg-success"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success mb-1">{totals.stock_assets}</div>
            <p className="text-xs text-success font-medium flex items-center">
              <span>↑ 5% from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-xl hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Issued</span>
              <div className="p-2 rounded-lg bg-warning/10">
                <div className="h-2 w-2 rounded-full bg-warning"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning mb-1">{totals.issued_assets}</div>
            <p className="text-xs text-warning font-medium flex items-center">
              <span>↑ 3% from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg rounded-xl hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Total Value</span>
              <div className="p-2 rounded-lg bg-accent/10">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">
              ${totals.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-success font-medium flex items-center">
              <span>↑ 8% from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">Branch Distribution</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex rounded-lg bg-secondary p-1">
              <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground transition-all duration-200 hover-lift">Table</button>
              <button className="px-3 py-1 text-sm rounded-md text-foreground hover:bg-secondary/80 transition-all duration-200 hover-lift">Chart</button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="font-semibold text-foreground">Branch</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Total Assets</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">In Stock</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Issued</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Total Value</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No branch data available
                    </TableCell>
                  </TableRow>
                ) : (
                  stockData.map((data) => (
                    <TableRow key={data.branch_name} className="hover:bg-secondary/30 transition-all duration-200 hover-lift">
                      <TableCell className="font-medium text-foreground">{data.branch_name}</TableCell>
                      <TableCell className="text-right font-medium">{data.total_assets}</TableCell>
                      <TableCell className="text-right text-success font-medium">{data.stock_assets}</TableCell>
                      <TableCell className="text-right text-primary font-medium">{data.issued_assets}</TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        ${data.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover-lift">
                          <Eye className="h-4 w-4 text-foreground" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="px-6 py-4 border-t border-border bg-secondary/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{stockData.length}</span> branches
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
      </Card>
    </div>
  );
};

export default StockView;