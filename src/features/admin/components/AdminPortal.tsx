import { useState } from "react";
import { WeeklyMenu } from "@/features/customer/components/WeeklyMenu";
import { OrderManagement } from "./OrderManagement";
import { DishLibrary } from "./DishLibrary";
import { Button } from "@/components/ui/button";
import { ClipboardList, Menu, X, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface AdminPortalProps {
  onClose: () => void;
}

export function AdminPortal({ onClose }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "orders" | "library">("library");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <span className="text-xl text-white">🔒</span>
              </div>
              <div>
                <h2 className="text-slate-900">Admin Portal</h2>
                <p className="text-sm text-slate-600">Quản lý nhà hàng</p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="mr-2 size-4" />
              Đóng
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("library")}
              className={`relative flex items-center gap-2 px-6 py-4 transition-all duration-200 ${
                activeTab === "library"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              } `}
            >
              <BookOpen className="size-4" />
              <span>Thư Viện Món</span>
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`relative flex items-center gap-2 px-6 py-4 transition-all duration-200 ${
                activeTab === "menu"
                  ? "border-b-2 border-[#00554d] text-[#00554d]"
                  : "text-slate-600 hover:text-slate-900"
              } `}
            >
              <Menu className="size-4" />
              <span>Menu Theo Ngày</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`relative flex items-center gap-2 px-6 py-4 transition-all duration-200 ${
                activeTab === "orders"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              } `}
            >
              <ClipboardList className="size-4" />
              <span>Quản lý Đơn hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "library" ? (
          <DishLibrary />
        ) : activeTab === "menu" ? (
          <WeeklyMenu />
        ) : (
          <OrderManagement />
        )}
      </motion.div>
    </div>
  );
}
