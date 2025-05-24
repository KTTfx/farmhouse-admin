import apiClient from "@/lib/api";

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const adminService = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post("/admin/login", {
            email,
            password,
        });

        const data = response.data;
        if (data.data && data.data.token) {
            localStorage.setItem('adminToken', data.data.token)
        }
        
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('adminToken')
    },

    // get shops
    getShops: async (page: number, limit: number) => {
        const response = await apiClient.get("/admin/shops", {
            params: {
                page,
                limit,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // get unapproved shops
    // getUnapprovedShops: async (page: number, limit: number) => {

    // approve shop
    approveShop: async (shopId: string) => {
        const response = await apiClient.post(`/admin/shops/${shopId}/approve`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // reject shop
    rejectShop: async (shopId: string) => {
        const response = await apiClient.post(`/admin/shops/${shopId}/reject`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // get shop details
    getShopDetails: async (shopId: string) => {
        const response = await apiClient.get(`/admin/shops/${shopId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // ban shop
    banShop: async (shopId: string) => {
        const response = await apiClient.post(`/admin/shops/${shopId}/ban`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // unban shop
    unbanShop: async (shopId: string) => {
        const response = await apiClient.post(`/admin/shops/${shopId}/unban`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // get users
    getUsers: async (page: number, limit: number) => {
        const response = await apiClient.get("/admin/users", {
            params: {
                page,
                limit,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },

    // get orders
    getOrders: async (page: number, limit: number) => {
        const response = await apiClient.get("/orders", {
            params: {
                page,
                limit,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },
    
    // get order details
    getOrderDetails: async (orderId: string) => {
        const response = await apiClient.get(`/admin/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        return response.data;
    },
}