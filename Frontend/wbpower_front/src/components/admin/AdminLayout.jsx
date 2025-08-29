import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import Header from "./AdminHeader";
import Footer from "./AdminFooter";

const AdminLayout = () => {
  const location = useLocation();

  // Hide sidebar/header/footer on login page
  const isPublicPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (hidden on small screens) */}
      {!isPublicPage && (
        <aside className="hidden md:block w-64 bg-gray-800 text-white w-[15%]">
          <Sidebar />
        </aside>
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${isPublicPage ? "w-full" : ""}`}>
        {!isPublicPage && <Header />}

        <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main>

        {!isPublicPage && <Footer />}
      </div>
    </div>
  );
};

export default AdminLayout;
