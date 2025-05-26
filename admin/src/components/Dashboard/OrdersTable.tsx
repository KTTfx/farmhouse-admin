import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
//   CheckCircle, 
//   XCircle, 
//   Ban, 
//   Check, 
  Info, 
  RefreshCw,
  Truck,
  Package,
//   Calendar,
  User,
  DollarSign,
  ShoppingBag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";


// Define interface for Order items
interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    description?: string;
  };
}

// Define interface for Order data structure
interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  orderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    phone: string;
  };
}

export const OrdersTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);    
    const [orderDetails, setOrderDetails] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);

        try {
            const response = await adminService.getOrders(currentPage, 10);
            console.log('Orders response', response);

            // Set orders from API response
            if (response.data && Array.isArray(response.data.orders)) {
                setOrders(response.data.orders);
                setTotalPages(Math.ceil(response.data.total / 10) || 1);
            } else {
                // Fallback if response structure is different
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "Failed to fetch orders. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const handleOpenDetails = async (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
        
        try {
            // Fetch detailed order information
            const response = await adminService.getOrderDetails(order.id);
            setOrderDetails(response.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast({
                title: "Error",
                description: "Failed to fetch order details.",
                variant: "destructive"
            });
        }
    };    
    
    const handledeleteOrder = async (orderId: string) => {
        setIsDeleting(true);
        
        try {
            await adminService.deleteOrder(orderId);
            
            toast({
                title: "Success",
                description: `Order has been deleted successfully`,
                variant: "default"
            });
        } catch (error) {
            console.error("Error deleting order:", error);
            toast({
                title: "Error",
                description: "Failed to update order status.",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PROCESSING':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
            case 'SHIPPED':
                return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Shipped</Badge>;
            case 'DELIVERED':
                return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
            case 'CANCELLED':
                return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'PPP');
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Orders</h2>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="border rounded-lg">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Orders Management</h2>
                <Button onClick={fetchOrders} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {orders.length === 0 ? (
                <div className="border rounded-lg p-8 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="text-sm text-gray-500 mt-2">There are no orders in the system yet.</p>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>GH₵{order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleOpenDetails(order)} variant="ghost" size="sm">
                                            <Info className="h-4 w-4 mr-2" />
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center justify-between border-t pt-4">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                    variant="outline"
                    size="sm"
                >
                    Previous
                </Button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isLoading}
                    variant="outline"
                    size="sm"
                >
                    Next
                </Button>
            </div>

            {/* Order details dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order #{orderDetails?.id.substring(0, 8)} placed on {orderDetails && formatDate(orderDetails.createdAt)}
                        </DialogDescription>
                    </DialogHeader>

                    {orderDetails ? (
                        <div className="space-y-6">
                            {/* Status and Actions */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center border-b pb-4">
                                <div>
                                    <h3 className="text-sm font-medium">Current Status</h3>
                                    <div className="mt-1">
                                        {getStatusBadge(orderDetails.orderStatus)}
                                    </div>
                                </div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium mr-2"></h3>
                                        <Button
                                            variant="outline" 
                                            size="sm" 
                                            className="flex items-center border-red-500 text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handledeleteOrder;
                                            }}
                                        >
                                            Delete Order
                                        </Button>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div>
                                <h3 className="text-base font-medium flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4" /> Customer Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Customer Name</h4>
                                        <p>{orderDetails.user?.firstName} {orderDetails.user?.lastName || ""}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                        <p>{orderDetails.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            {orderDetails.shippingAddress && (
                                <div>
                                    <h3 className="text-base font-medium flex items-center gap-2 mb-2">
                                        <Truck className="h-4 w-4" /> Shipping Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Recipient</h4>
                                            <p>{orderDetails.shippingAddress.fullName}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                                            <p>{orderDetails.shippingAddress.phone}</p>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                            <p>
                                                {orderDetails.shippingAddress.street}, {orderDetails.shippingAddress.city}, {" "}
                                                {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.country}{" "}
                                                {orderDetails.shippingAddress.zipCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <h3 className="text-base font-medium flex items-center gap-2 mb-2">
                                    <Package className="h-4 w-4" /> Order Items
                                </h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-right">Quantity</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orderDetails.orderItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.product?.name || "Product"}</TableCell>
                                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">GH₵{item.price.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right">GH₵{(item.price * item.quantity).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <h3 className="text-base font-medium flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4" /> Order Summary
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>GH₵{orderDetails.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Platform Fee (5%)</span>
                                        <span>GH₵{(orderDetails.totalAmount * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>GH₵{(orderDetails.totalAmount * 1.05).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Skeleton className="h-4 w-32 mx-auto mb-4" />
                            <Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setIsDetailsOpen(false)} variant="outline">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}