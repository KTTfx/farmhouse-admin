import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ShopTable } from "@/components/Dashboard/ShopTable";
// import { useToast } from "@/components/ui/use-toast";
import { UsersTable } from "@/components/Dashboard/UsersTable";
// import { OrdersTable } from '@/components/Dashboard/OrdersTable'
import { Store, Users, Settings } from "lucide-react";
import { AdminLayout } from "@/components/Layout/AdminLayout";

const Admin = () => {
  return (
    <AdminLayout>
      <div className="py-8 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">
              Manage shops, products, and platform settings
            </p>
          </div>
          
          <Tabs defaultValue="shops" className="w-full">
            <div className="border-b border-gray-200 mb-4">
              <TabsList className="h-auto py-2 px-2 bg-transparent justify-center w-full">
                <TabsTrigger 
                  value="shops"
                  className="data-[state=active]:bg-ghana-green data-[state=active]:text-white px-4 py-2 text-xs"
                >
                  <Store className="h-4.5 w-4.5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="users"
                  className="data-[state=active]:bg-ghana-green data-[state=active]:text-white px-4 py-2 text-xs mx-1"
                >
                  <Users className="h-4.5 w-4.5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className="data-[state=active]:bg-ghana-green data-[state=active]:text-white px-4 py-2 text-xs"
                >
                  <Settings className="h-4.5 w-4.5" />
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="shops">
              <Card className="border-0 sm:border p-3 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Shops</h2>
                <div className="overflow-x-auto">
                  <ShopTable />
                </div>
              </Card>
            </TabsContent>
            
            {/* <TabsContent value="products">
              <Card className="border-0 sm:border p-3 sm:p-6">
                <div className="text-center py-8 sm:py-12">
                  <p className="text-muted-foreground">Products management coming soon</p>
                </div>
              </Card>
            </TabsContent>
             */}
            
            <TabsContent value="orders">
              <Card className="border-0 sm:border p-3 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                <div className="overflow-x-auto">
                  {/* <OrdersTable /> */}
                </div>
              </Card>
            </TabsContent>
            
             
            <TabsContent value="users">
              <Card className="border-0 sm:border p-3 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                <div className="overflow-x-auto">
                  <UsersTable />
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="border-0 sm:border p-3 sm:p-6">
                <div className="text-center py-8 sm:py-12">
                  <p className="text-muted-foreground">Platform settings coming soon</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
