import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-ghana-green text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="font-bold text-xl">Admin Portal</Link>
            {/* <nav>
              <Link to="/" className="text-white hover:text-white/80">
                Login
              </Link>
            </nav> */}
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Admin Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
