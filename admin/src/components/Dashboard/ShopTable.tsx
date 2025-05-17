import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Ban, 
  Check, 
  Info, 
  RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Shop = {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  location?: string;
  phoneNumber?: string;
  description?: string;
  isApproved: boolean;
  isBanned: boolean;
  isVerified: boolean;
  createdAt: string;
};

export const ShopTable = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch shops from API
  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getShops(currentPage, 10);
      console.log("Shops response:", response);
      
      // Assuming the API returns data in a specific structure
      // Adjust this based on your actual API response
      if (response.data && Array.isArray(response.data.shops)) {
        setShops(response.data.shops);
        setTotalPages(Math.ceil(response.data.total / 10) || 1);
      } else {
        // Fallback if response structure is different
        setShops(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast({
        title: "Error",
        description: "Failed to fetch shops. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [currentPage]);

  // View shop details
  const handleViewDetails = async (shop: Shop) => {
    setSelectedShop(shop);
    
    try {
      // Fetch detailed information if needed
      const detailedInfo = await adminService.getShopDetails(shop.id);
      if (detailedInfo.data) {
        setSelectedShop({...shop, ...detailedInfo.data});
      }
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
    
    setIsDetailsOpen(true);
  };

  // Approve shop
  const handleApprove = async (id: string) => {
    setIsLoading(true);
    try {
      await adminService.approveShop(id);
      toast({
        title: "Shop Approved",
        description: "The shop has been successfully approved."
      });
      // Refresh the shop list
      fetchShops();
    } catch (error) {
      console.error("Error approving shop:", error);
      toast({
        title: "Error",
        description: "Failed to approve shop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reject shop
  const handleReject = async (id: string) => {
    setIsLoading(true);
    try {
      await adminService.rejectShop(id);
      toast({
        title: "Shop Rejected",
        description: "The shop has been rejected."
      });
      // Refresh the shop list
      fetchShops();
    } catch (error) {
      console.error("Error rejecting shop:", error);
      toast({
        title: "Error",
        description: "Failed to reject shop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ban shop
  const handleBan = async (id: string) => {
    setIsLoading(true);
    try {
      await adminService.banShop(id);
      toast({
        title: "Shop Banned",
        description: "The shop has been banned."
      });
      // Refresh the shop list
      fetchShops();
    } catch (error) {
      console.error("Error banning shop:", error);
      toast({
        title: "Error",
        description: "Failed to ban shop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Unban shop
  const handleUnban = async (id: string) => {
    setIsLoading(true);
    try {
      await adminService.unbanShop(id);
      toast({
        title: "Shop Unbanned",
        description: "The shop has been unbanned."
      });
      // Refresh the shop list
      fetchShops();
    } catch (error) {
      console.error("Error unbanning shop:", error);
      toast({
        title: "Error",
        description: "Failed to unban shop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get appropriate status badge for a shop
  const getShopStatus = (shop: Shop) => {
    if (shop.isBanned) {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Banned</Badge>;
    }
    if (!shop.isApproved) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
    if (shop.isApproved) {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Unknown</Badge>;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!shops.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No shops found</p>
        <Button 
          variant="outline" 
          onClick={fetchShops}
          className="inline-flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-md">
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
                Location
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
              <tr 
                key={shop.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewDetails(shop)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                  <div className="text-xs text-gray-500">{shop.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{shop.ownerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{shop.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(shop.createdAt), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getShopStatus(shop)}
                  {!shop.isVerified && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 ml-2">Unverified</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(shop);
                      }}
                    >
                      <Info className="mr-1 h-4 w-4" />
                      Details
                    </Button>

                    {!shop.isApproved && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center border-green-500 text-green-500 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(shop.id);
                        }}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    )}

                    {!shop.isApproved && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center border-red-500 text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(shop.id);
                        }}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    )}

                    {shop.isBanned ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center border-green-500 text-green-500 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnban(shop.id);
                        }}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Unban
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center border-red-500 text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBan(shop.id);
                        }}
                      >
                        <Ban className="mr-1 h-4 w-4" />
                        Ban
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Shop Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected shop.
            </DialogDescription>
          </DialogHeader>
          
          {selectedShop && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Shop Name</p>
                  <p className="text-base">{selectedShop.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Owner</p>
                  <p className="text-base">{selectedShop.ownerName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{selectedShop.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-base">{selectedShop.phoneNumber || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base">{selectedShop.location || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Registration Date</p>
                  <p className="text-base">{format(new Date(selectedShop.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getShopStatus(selectedShop)}
                    {!selectedShop.isVerified && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Unverified</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedShop.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base">{selectedShop.description}</p>
                </div>
              )}
              
              <div className="border-t pt-4 flex flex-wrap justify-end gap-2">
                {!selectedShop.isApproved && (
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={() => {
                      handleApprove(selectedShop.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Shop
                  </Button>
                )}
                
                {selectedShop.isBanned ? (
                  <Button 
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => {
                      handleUnban(selectedShop.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Unban Shop
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleBan(selectedShop.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban Shop
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
