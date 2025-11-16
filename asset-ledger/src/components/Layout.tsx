import { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Package,
  Users,
  FolderTree,
  Building2,
  ArrowRightLeft,
  BarChart3,
  Menu,
  Settings,
  Bell,
  Search,
  User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-sidebar-border shadow-lg">
          <SidebarHeader className="border-b border-sidebar-border p-4 bg-sidebar-background/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-md">
                <img 
                  src="/kttask.webp" 
                  alt="KT Task Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-sidebar-foreground">KT Task</h2>
                <p className="text-xs text-sidebar-foreground/70 font-medium">Asset Management</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold py-2 text-xs uppercase tracking-wider">Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/dashboard">
                        <BarChart3 className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/stock-view">
                        <Package className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Stock View</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold py-2 text-xs uppercase tracking-wider">Masters</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/employees">
                        <Users className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Employees</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/assets">
                        <Package className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Assets</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/categories">
                        <FolderTree className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Categories</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/branches">
                        <Building2 className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Branches</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold py-2 text-xs uppercase tracking-wider">Transactions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="/transactions">
                        <ArrowRightLeft className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">All Transactions</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold py-2 text-xs uppercase tracking-wider">Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="py-2 px-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 hover-lift">
                      <NavLink to="#">
                        <Settings className="h-5 w-5 text-sidebar-foreground" />
                        <span className="text-sidebar-foreground font-medium">Settings</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;