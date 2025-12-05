import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, Calendar, Clock, Send, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner@2.0.3";
import { supabaseConfig } from "@/lib/supabase/client";
const { projectId, anonKey: publicAnonKey } = supabaseConfig;
import logo from "figma:asset/da0287e4ba0aca17a7f033d98e20aceb35365d22.png";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  day: string;
  isSpecial: boolean;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface OrderInfo {
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
}

const categoryColors: Record<string, string> = {
  "Khai vị": "bg-amber-100 text-amber-800 border-amber-300",
  "Món chính": "bg-green-100 text-green-800 border-green-300",
  "Canh": "bg-blue-100 text-blue-800 border-blue-300",
  "Tráng miệng": "bg-pink-100 text-pink-800 border-pink-300",
  "Đồ uống": "bg-purple-100 text-purple-800 border-purple-300"
};

const categories = ["Tất cả", "Khai vị", "Món chính", "Canh", "Tráng miệng", "Đồ uống"];

export function OrderingSystem() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    customerName: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    notes: ""
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/menu`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Only show available items
        setMenuItems(data.data.filter((item: MenuItem) => item.available));
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Đã thêm ${item.name} vào giỏ hàng`);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      );
      return updated.filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Đã xóa khỏi giỏ hàng");
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sendOrderToMessenger = async () => {
    if (!orderInfo.customerName || !orderInfo.phone || !orderInfo.address || !orderInfo.deliveryDate || !orderInfo.deliveryTime) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (cart.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    // Validate cut-off time (2 hours minimum)
    const selectedDate = new Date(orderInfo.deliveryDate);
    const [startTime] = orderInfo.deliveryTime.split(" - ");
    const [hours, minutes] = startTime.split(":").map(Number);
    selectedDate.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const diffInHours = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 2) {
      toast.error("Vui lòng chọn thời gian giao hàng ít nhất 2 giờ kể từ bây giờ");
      return;
    }

    // Save order to database
    try {
      const orderData = {
        customerName: orderInfo.customerName,
        phone: orderInfo.phone,
        address: orderInfo.address,
        deliveryDate: orderInfo.deliveryDate,
        deliveryTime: orderInfo.deliveryTime,
        notes: orderInfo.notes,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getTotalPrice()
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        toast.error("Lỗi khi tạo đơn hàng");
        return;
      }

      // Create order message for Messenger
      let message = `🌿 ĐƠN ĐẶT HÀNG MỚI - BẾP CHAY DÌ MUỘN\n\n`;
      message += `📋 Mã đơn: ${data.data.orderNumber}\n`;
      message += `👤 Khách hàng: ${orderInfo.customerName}\n`;
      message += `📞 SĐT: ${orderInfo.phone}\n`;
      message += `📍 Địa chỉ: ${orderInfo.address}\n`;
      message += `📅 Ngày giao: ${orderInfo.deliveryDate}\n`;
      message += `🕐 Giờ giao: ${orderInfo.deliveryTime}\n\n`;
      message += `🍽️ DANH SÁCH MÓN:\n`;
      
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
      });
      
      message += `\n💰 TỔNG TIỀN: ${formatPrice(getTotalPrice())}\n`;
      
      if (orderInfo.notes) {
        message += `\n📝 Ghi chú: ${orderInfo.notes}`;
      }

      // Copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        toast.success(`Đơn hàng ${data.data.orderNumber} đã được tạo thành công!`, {
          duration: 5000,
        });
        
        // Show confirmation options
        const confirmAction = confirm(
          `✅ Đơn hàng ${data.data.orderNumber} đã được lưu!\n\n` +
          "Đơn hàng đã được sao chép vào clipboard.\n\n" +
          "Bạn có muốn gọi điện để xác nhận ngay không?\n\n" +
          "📞 0979637958"
        );
        
        if (confirmAction) {
          window.location.href = "tel:0979637958";
        } else {
          // Open messenger
          alert("Vui lòng mở Messenger và dán đơn hàng để gửi cho chúng tôi!\n\nChúng tôi sẽ xác nhận đơn hàng sớm nhất có thể.");
          window.open("https://m.me/", "_blank");
        }
        
        // Reset cart and form
        setCart([]);
        setOrderInfo({
          customerName: "",
          phone: "",
          address: "",
          deliveryDate: "",
          deliveryTime: "",
          notes: ""
        });
        setCheckoutOpen(false);
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    }
  };

  const filteredItems = selectedCategory === "Tất cả" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4"
          >
            <span className="text-white text-2xl">🌿</span>
          </motion.div>
          <p className="text-green-700">Đang tải thực đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" 
          }} />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.img
              src={logo}
              alt="Bếp Chay Dì Muộn"
              className="h-32 md:h-40 w-auto mx-auto mb-6 drop-shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <h1 className="mb-4">Chào mừng đến với Bếp Chay Dì Muộn</h1>
            <p className="text-xl mb-6 text-green-50">
              Món ngon từ rau củ quả, đậu và nấm - 100% thực vật
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <p className="text-sm text-green-50">📞 Hotline</p>
                <p className="text-lg">0979 637 958</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <p className="text-sm text-green-50">🕐 Giờ mở cửa</p>
                <p className="text-lg">7:00 - 21:00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-green-600 to-emerald-600"
                    : "border-green-200 hover:bg-green-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-8">
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                  {item.imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {item.isSpecial && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-amber-500 text-white shadow-lg">⭐ Đặc biệt</Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-green-900">{item.name}</CardTitle>
                      <Badge className={categoryColors[item.category] || "bg-gray-100"}>
                        {item.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-700">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">{formatPrice(item.price)}</span>
                      <Button
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Plus className="size-4 mr-2" />
                        Thêm
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500">Không có món nào trong danh mục này</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Cart Button */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetTrigger asChild>
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="lg"
              className="rounded-full h-16 w-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl relative"
            >
              <ShoppingCart className="size-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-green-900">Giỏ hàng của bạn</SheetTitle>
            <SheetDescription>
              {cart.length === 0 ? "Chưa có món nào" : `${cart.length} món đã chọn`}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Giỏ hàng trống</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-100"
                    >
                      {item.imageUrl && (
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-green-900 mb-1">{item.name}</h4>
                        <p className="text-green-700 mb-2">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="size-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 p-0 ml-auto"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="border-t border-green-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-green-900">Tổng cộng:</span>
                    <span className="text-green-700">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <Button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Send className="size-4 mr-2" />
                    Tiếp tục đặt hàng
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Checkout Sheet */}
      <Sheet open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-green-900">Thông tin đặt hàng</SheetTitle>
            <SheetDescription>
              Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="customerName">Họ và tên *</Label>
              <Input
                id="customerName"
                value={orderInfo.customerName}
                onChange={(e) => setOrderInfo({ ...orderInfo, customerName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="border-green-200"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                type="tel"
                value={orderInfo.phone}
                onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                placeholder="0979637958"
                className="border-green-200"
              />
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ giao hàng *</Label>
              <Textarea
                id="address"
                value={orderInfo.address}
                onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                placeholder="Số nhà, tên đường, quận/huyện, thành phố"
                rows={3}
                className="border-green-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Ngày giao *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={orderInfo.deliveryDate}
                  onChange={(e) => setOrderInfo({ ...orderInfo, deliveryDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="border-green-200"
                />
                <p className="text-xs text-gray-500 mt-1">Đặt trước tối đa 7 ngày</p>
              </div>

              <div>
                <Label htmlFor="deliveryTime">Giờ giao *</Label>
                <Select
                  value={orderInfo.deliveryTime}
                  onValueChange={(value) => setOrderInfo({ ...orderInfo, deliveryTime: value })}
                >
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7:00 - 8:00">7:00 - 8:00</SelectItem>
                    <SelectItem value="8:00 - 9:00">8:00 - 9:00</SelectItem>
                    <SelectItem value="9:00 - 10:00">9:00 - 10:00</SelectItem>
                    <SelectItem value="10:00 - 11:00">10:00 - 11:00</SelectItem>
                    <SelectItem value="11:00 - 12:00">11:00 - 12:00</SelectItem>
                    <SelectItem value="12:00 - 13:00">12:00 - 13:00</SelectItem>
                    <SelectItem value="13:00 - 14:00">13:00 - 14:00</SelectItem>
                    <SelectItem value="14:00 - 15:00">14:00 - 15:00</SelectItem>
                    <SelectItem value="15:00 - 16:00">15:00 - 16:00</SelectItem>
                    <SelectItem value="16:00 - 17:00">16:00 - 17:00</SelectItem>
                    <SelectItem value="17:00 - 18:00">17:00 - 18:00</SelectItem>
                    <SelectItem value="18:00 - 19:00">18:00 - 19:00</SelectItem>
                    <SelectItem value="19:00 - 20:00">19:00 - 20:00</SelectItem>
                    <SelectItem value="20:00 - 21:00">20:00 - 21:00</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-amber-600 mt-1">⚠️ Phải đặt trước ít nhất 2 giờ</p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú (không bắt buộc)</Label>
              <Textarea
                id="notes"
                value={orderInfo.notes}
                onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                placeholder="Yêu cầu đặc biệt..."
                rows={3}
                className="border-green-200"
              />
            </div>

            <div className="border-t border-green-200 pt-4">
              <div className="bg-green-50 p-4 rounded-xl mb-4">
                <h4 className="text-green-900 mb-2">Tóm tắt đơn hàng</h4>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-green-200 mt-2 pt-2 flex justify-between">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <Button
                onClick={sendOrderToMessenger}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Send className="size-4 mr-2" />
                Gửi đơn hàng
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Đơn hàng sẽ được lưu và gửi qua Messenger để nhân viên xác nhận.<br/>
                ⏰ Lưu ý: Phải đặt trước ít nhất 2 giờ.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}