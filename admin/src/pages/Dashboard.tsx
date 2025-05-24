import { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Store, 
  Package,
  Settings,
  BarChart3
} from "lucide-react";
import { OrdersTable } from "@/components/Dashboard/OrdersTable";

// Import the UI components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Dashboard container component
export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="shops" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Shops</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-3xl font-bold">423</p>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Shops</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-3xl font-bold">48</p>
                <Store className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-3xl font-bold">1,285</p>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-3xl font-bold">784</p>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Sales Overview</h3>
              <select className="text-sm border rounded p-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-300" />
              <span className="ml-4 text-gray-500">Analytics data would appear here</span>
            </div>
          </div>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
        
        {/* Shops Tab */}
        <TabsContent value="shops">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Shops Management</h2>
            <p className="text-gray-500">Shops table component would be placed here.</p>
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Users Management</h2>
            <p className="text-gray-500">Users table component would be placed here.</p>
          </div>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Products Management</h2>
            <p className="text-gray-500">Products table component would be placed here.</p>
          </div>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
            <p className="text-gray-500">Settings form would be placed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
