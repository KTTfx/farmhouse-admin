import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService, User } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { 
  UserCog,
  User2Icon,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { format } from "date-fns";

export const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers(currentPage, 10);
      // console.log("Users response:", response);
      
      // Assuming the API returns data in a specific structure
      // Adjust this based on your actual API response
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalPages(Math.ceil(response.data.total / 10) || 1);
      } else {
        // Fallback if response structure is different
        setUsers(response.data || []);
      }
    } catch (error) {
      // console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount and when page changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // View user details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  // Get role badge for user
  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'MODERATOR':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Moderator</Badge>;
      case 'USER':
        return <Badge className="bg-green-100 text-green-800 border-green-200">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (roleFilter === 'all') return matchesSearch;
    return matchesSearch && user.role.toUpperCase() === roleFilter.toUpperCase();
  });

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
  if (!users.length) {
    return (
      <div className="text-center py-10">
        <User2Icon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500 mb-4">No users found</p>
        <Button 
          variant="outline" 
          onClick={fetchUsers}
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              {/* <SelectItem value="moderator">Moderator</SelectItem> */}
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setRoleFilter("all");
          }}
          size="icon"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Reset filters</span>
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr 
                key={user.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User2Icon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.firstName + " " + user.lastName || 'No Name'}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                    className="mr-2"
                  >
                    <UserCog className="h-4 w-4 mr-1" />
                    Details
                  </Button>
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

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center mb-2">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  {selectedUser.role.toUpperCase() === 'ADMIN' ? (
                    <ShieldAlert className="h-10 w-10 text-red-500" />
                  ) : selectedUser.role.toUpperCase() === 'MODERATOR' ? (
                    <ShieldCheck className="h-10 w-10 text-blue-500" />
                  ) : (
                    <User2Icon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base">{selectedUser.firstName + " " + selectedUser.lastName || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="text-base">{selectedUser.id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{selectedUser.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <div className="mt-1">
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 flex flex-wrap justify-end gap-2">
                {/* These buttons would need additional functionality in your admin.service.ts */}
                {selectedUser.role.toUpperCase() !== 'ADMIN' && (
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
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