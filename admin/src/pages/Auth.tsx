
import { AdminAuthForm } from "@/components/Auth/AdminAuthForm";
import { AdminLayout } from "@/components/Layout/AdminLayout";

const Auth = () => {
  return (
    <AdminLayout>
      <div className="py-8 sm:py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Login</h1>
          <AdminAuthForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Auth;
