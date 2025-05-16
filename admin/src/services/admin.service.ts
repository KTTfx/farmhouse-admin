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

    // get unapproved shops

    // approve shop

    // reject shop

    // get shop details

    // ban shop

    // unban shop
}