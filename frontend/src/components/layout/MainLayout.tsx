// Responsibility: Main responsive shell layout combining Sidebar, Header, and content outlet

import { Outlet } from "react-router-dom";
import { Box } from "@/components/ui/Box";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const MainLayout = () => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Sidebar />
      <Box className="lg:pl-64">
        <Header />
        <Box className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
