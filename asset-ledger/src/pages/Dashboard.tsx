import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Building2, TrendingUp, DollarSign, Activity, Clock, CheckCircle } from "lucide-react";
import apiClient from "@/integrations/api/client";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    stockAssets: 0,
    issuedAssets: 0,
    totalEmployees: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // For now, we'll simulate the dashboard data
      // In a real implementation, you would create endpoints in your Express app
      // that return this aggregated data
      setStats({
        totalAssets: 125,
        stockAssets: 78,
        issuedAssets: 42,
        totalEmployees: 25,
        totalValue: 324300.00,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12% from last month",
      changeColor: "text-success",
    },
    {
      title: "In Stock",
      value: stats.stockAssets,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      change: "+5% from last month",
      changeColor: "text-success",
    },
    {
      title: "Issued Assets",
      value: stats.issuedAssets,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+3% from last month",
      changeColor: "text-primary",
    },
    {
      title: "Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+2 new hires",
      changeColor: "text-success",
    },
  ];

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
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your assets today.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="border-0 shadow-lg rounded-xl transition-all duration-300 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <p className={`text-xs ${stat.changeColor} font-medium flex items-center`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2 border-0 shadow-lg rounded-xl hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Asset Value Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <p className="text-muted-foreground">Total Asset Value</p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6">
                  <div className="text-center p-4 bg-primary/5 rounded-xl">
                    <p className="text-2xl font-bold text-primary">+12.5%</p>
                    <p className="text-sm text-muted-foreground">from last quarter</p>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-xl">
                    <p className="text-2xl font-bold text-success">$42.3K</p>
                    <p className="text-sm text-muted-foreground">avg. asset value</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg rounded-xl hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all duration-200">
                <div className="p-2 rounded-lg bg-primary/10 mr-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">New laptop assigned</p>
                  <p className="text-sm text-muted-foreground">to John Smith • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all duration-200">
                <div className="p-2 rounded-lg bg-success/10 mr-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Asset returned</p>
                  <p className="text-sm text-muted-foreground">from Jane Doe • 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all duration-200">
                <div className="p-2 rounded-lg bg-warning/10 mr-3">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Maintenance due</p>
                  <p className="text-sm text-muted-foreground">Server #1245 • Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all duration-200">
                <div className="p-2 rounded-lg bg-accent/10 mr-3">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">New employee onboarded</p>
                  <p className="text-sm text-muted-foreground">Robert Johnson • 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;