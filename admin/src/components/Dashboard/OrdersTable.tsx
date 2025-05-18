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

type Orders = {
    id: string;
    userId: string;
    totalAmout: number;
    orderStatus: string;
    createdAt: string;
}

export const OrdersTable = () => {
    const [orders, setOrders] = useState<Orders[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true)

        try {
            const response = await adminService.getOrders(currentPage, 10)
            console.log('Orders response', response);

            // Assuming the API returns data in a specific structure
            // Adjust this based on your actual API response
            if (response.data && Array.isArray(response.data.shops)) {
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
    }

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);
}