import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ClipboardList, Phone, MapPin, Calendar, Clock, Package, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  preparing: "bg-purple-100 text-purple-800 border-purple-300",
  delivering: "bg-orange-100 text-orange-800 border-orange-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300"
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  delivering: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy"
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/orders`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Lỗi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchOrders();
      } else {
        toast.error("Lỗi cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Xóa đơn hàng thành công");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Lỗi xóa đơn hàng");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      confirmed: orders.filter(o => o.status === "confirmed").length,
      delivering: orders.filter(o => o.status === "delivering").length,
      completed: orders.filter(o => o.status === "completed").length,
    };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ClipboardList className="size-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-blue-700">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 shadow-lg border border-blue-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ClipboardList className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-blue-900">Quản Lý Đơn Hàng</h1>
            <p className="text-blue-600">Theo dõi và xử lý đơn hàng từ khách</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-blue-600 text-sm mb-1">Tổng đơn</p>
              <p className="text-blue-900 text-2xl">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-4 text-center">
              <p className="text-yellow-600 text-sm mb-1">Chờ xác nhận</p>
              <p className="text-yellow-900 text-2xl">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-blue-600 text-sm mb-1">Đã xác nhận</p>
              <p className="text-blue-900 text-2xl">{stats.confirmed}</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4 text-center">
              <p className="text-orange-600 text-sm mb-1">Đang giao</p>
              <p className="text-orange-900 text-2xl">{stats.delivering}</p>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-green-600 text-sm mb-1">Hoàn thành</p>
              <p className="text-green-900 text-2xl">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-64 border-blue-200">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đơn hàng</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
            <SelectItem value="delivering">Đang giao hàng</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-blue-200 hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-blue-900 mb-1">
                          Đơn hàng {order.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-blue-600">
                          Đặt lúc: {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-48 border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xác nhận</SelectItem>
                          <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                          <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                          <SelectItem value="delivering">Đang giao hàng</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="text-blue-900 mb-3">Thông tin khách hàng</h4>
                      <div className="flex items-start gap-2 text-sm">
                        <Package className="size-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Tên khách hàng</p>
                          <p className="text-gray-900">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Phone className="size-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Số điện thoại</p>
                          <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">
                            {order.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="size-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Địa chỉ</p>
                          <p className="text-gray-900">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="size-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Ngày giao</p>
                          <p className="text-gray-900">{order.deliveryDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="size-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Giờ giao</p>
                          <p className="text-gray-900">{order.deliveryTime}</p>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                          <p className="text-amber-900 text-sm">
                            <strong>Ghi chú:</strong> {order.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-blue-900 mb-3">Danh sách món</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
                          >
                            <div>
                              <p className="text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">x{item.quantity}</p>
                            </div>
                            <p className="text-blue-700">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-blue-200 mt-4 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-900">Tổng cộng:</span>
                          <span className="text-blue-700 text-xl">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="border-gray-200">
            <CardContent className="py-12 text-center">
              <ClipboardList className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
