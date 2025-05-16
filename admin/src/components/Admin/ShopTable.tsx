import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Shop = {
  id: string;
  name: string;
  owner: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

// Mock data for demonstration
const mockShops: Shop[] = [
  {
    id: "1",
    name: "Fresh Farms",
    owner: "John Doe",
    email: "john@freshfarms.com",
    status: "pending",
    createdAt: "2024-05-01"
  },
  {
    id: "2",
    name: "Organic Goods",
    owner: "Jane Smith",
    email: "jane@organicgoods.com",
    status: "approved",
    createdAt: "2024-04-15"
  },
  {
    id: "3",
    name: "Local Harvest",
    owner: "Michael Brown",
    email: "michael@localharvest.com",
    status: "rejected",
    createdAt: "2024-04-28"
  },
  {
    id: "4",
    name: "Green Market",
    owner: "Sarah Johnson",
    email: "sarah@greenmarket.com",
    status: "pending",
    createdAt: "2024-05-02"
  }
];

export const ShopTable = () => {
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setIsLoading(true);
    // In a real app, make an API call here
    setTimeout(() => {
      setShops(shops.map(shop => 
        shop.id === id ? { ...shop, status: "approved" as const } : shop
      ));
      toast({
        title: "Shop Approved",
        description: "The shop has been successfully approved."
      });
      setIsLoading(false);
    }, 500);
  };

  const handleReject = (id: string) => {
    setIsLoading(true);
    // In a real app, make an API call here
    setTimeout(() => {
      setShops(shops.map(shop => 
        shop.id === id ? { ...shop, status: "rejected" as const } : shop
      ));
      toast({
        title: "Shop Rejected",
        description: "The shop has been rejected."
      });
      setIsLoading(false);
    }, 500);
  };

  const getStatusBadgeClass = (status: Shop["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shop Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shops.map((shop) => (
            <tr key={shop.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{shop.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{shop.owner}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{shop.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{shop.createdAt}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(shop.status)}`}>
                  {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {shop.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => handleApprove(shop.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleReject(shop.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
                {shop.status !== "pending" && (
                  <span className="text-gray-400">No actions available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
