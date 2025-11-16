import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { ShoppingCart, Plus, Minus, Trash2, Send, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import logo from "figma:asset/9c86d23f18fc72c44e1d78d8a22180272cd5d4f6.png";
import bannerImage from "../../assets/BANNER (10).png";
import { getWeekIdentifier } from "../utils/weekHelpers";
import { provinces, districts, wards } from "../utils/vietnamLocations";
// @ts-expect-error - lunar-javascript doesn't have TypeScript types
import { Solar } from "lunar-javascript";

interface SizeOption {
  name: string;
  servings: number;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  day: string;
  weekId: string; // Add week identifier
  isSpecial: boolean;
  available: boolean;
  sizeOptions?: SizeOption[];
}

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  quantity: number;
  selectedSize: SizeOption;
}

interface OrderInfo {
  customerName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
}

const DAYS_OF_WEEK = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

const categoryColors: Record<string, string> = {
  "Món Cuốn": "bg-amber-100 text-amber-800 border-amber-300",
  "Món dùng kèm Bánh Mì": "bg-orange-100 text-orange-800 border-orange-300",
  "Mì/ Bún/ Bánh canh": "bg-blue-100 text-blue-800 border-blue-300",
  "Mì/ Bún Xào": "bg-purple-100 text-purple-800 border-purple-300",
  "Nước uống": "bg-teal-100 text-teal-800 border-teal-300",
};

// Helper function to get date for a day in current week
const getDateForDay = (dayName: string, weekOffset: number = 0): Date => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const targetDayIndex = DAYS_OF_WEEK.indexOf(dayName);

  // Calculate days difference
  let daysToAdd = targetDayIndex - (currentDay === 0 ? 6 : currentDay - 1);
  daysToAdd += weekOffset * 7;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  return targetDate;
};

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

// Helper to check if a day is today
const isToday = (dayName: string, weekOffset: number = 0): boolean => {
  const targetDate = getDateForDay(dayName, weekOffset);
  const today = new Date();
  return targetDate.toDateString() === today.toDateString();
};

// Helper to check if a date is rằm (15th) or mồng 1 (1st) of lunar month
const isLunarSpecialDay = (date: Date): { isSpecial: boolean; label: string } => {
  try {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const day = lunar.getDay();

    if (day === 1) {
      return { isSpecial: true, label: "Mùng 1" };
    } else if (day === 15) {
      return { isSpecial: true, label: "Rằm" };
    }
    return { isSpecial: false, label: "" };
  } catch (error) {
    console.error("Error calculating lunar date:", error);
    return { isSpecial: false, label: "" };
  }
};

export function CustomerView() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial mount
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(
    DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  );
  const [weekOffset, setWeekOffset] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderMessageDialog, setOrderMessageDialog] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  // Add to cart dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [orderInfo, setOrderInfo] = useState<OrderInfo>(() => {
    // Load order info from localStorage on initial mount
    try {
      const savedOrderInfo = localStorage.getItem("orderInfo");
      return savedOrderInfo ? JSON.parse(savedOrderInfo) : {
        customerName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        deliveryDate: "",
        deliveryTime: "",
        notes: "",
      };
    } catch (error) {
      console.error("Error loading orderInfo from localStorage:", error);
      return {
        customerName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        deliveryDate: "",
        deliveryTime: "",
        notes: "",
      };
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Save orderInfo to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
    } catch (error) {
      console.error("Error saving orderInfo to localStorage:", error);
    }
  }, [orderInfo]);

  // Safety: Reset submitting state when component mounts or checkout dialog state changes
  useEffect(() => {
    if (!checkoutOpen) {
      setSubmitting(false);
    }
  }, [checkoutOpen]);

  useEffect(() => {
    // Initial fetch
    fetchMenu();
    
    // Poll for updates every 30 seconds
    const pollInterval = setInterval(() => {
      fetchMenu();
    }, 30000);
    
    return () => clearInterval(pollInterval);
  }, []);

  const fetchMenu = async () => {
    try {
      const currentWeekId = getWeekIdentifier(new Date());
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
        // Filter by current week and available items
        const currentWeekItems = data.data.filter(
          (item: MenuItem) => item.available && (item.weekId === currentWeekId || !item.weekId)
        );
        setMenuItems(currentWeekItems);
        console.log(`Loaded ${currentWeekItems.length} items for current week ${currentWeekId}`);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(
    (item: MenuItem) => {
      // Only allow items from selected day
      if (item.day !== selectedDay) {
        toast.error(`Món này thuộc ${item.day}, không thể thêm vào giỏ hàng`);
        return;
      }

      // Open dialog to select quantity and size
      setSelectedItem(item);
      setSelectedQuantity(1);

      // Set default size (first option or fallback)
      if (item.sizeOptions && item.sizeOptions.length > 0) {
        setSelectedSize(item.sizeOptions[0]);
      } else {
        setSelectedSize({ name: "Phần tiêu chuẩn", servings: 1, price: item.price });
      }

      setAddDialogOpen(true);
    },
    [selectedDay]
  );

  const confirmAddToCart = () => {
    if (!selectedItem || !selectedSize) return;

    const cartItemId = `${selectedItem.id}-${selectedSize.name}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + selectedQuantity } : i
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          menuItemId: selectedItem.id,
          name: selectedItem.name,
          description: selectedItem.description,
          category: selectedItem.category,
          imageUrl: selectedItem.imageUrl,
          quantity: selectedQuantity,
          selectedSize: selectedSize,
        },
      ];
    });

    toast.success(
      `Đã thêm ${selectedQuantity} ${selectedItem.name} (${selectedSize.name}) vào giỏ hàng`
    );
    setAddDialogOpen(false);
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
    return cart.reduce((sum, item) => {
      return sum + item.selectedSize.price * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const submitOrder = async () => {
    try {
      console.log("=== START ORDER SUBMISSION ===");
      
      if (submitting) {
        console.log("Already submitting, abort");
        return;
      }

      setSubmitting(true);
      console.log("Set submitting = true");

      if (
        !orderInfo.customerName ||
        !orderInfo.phone ||
        !orderInfo.province ||
        !orderInfo.district ||
        !orderInfo.address ||
        !orderInfo.deliveryDate ||
        !orderInfo.deliveryTime
      ) {
        console.log("Validation failed:", orderInfo);
        toast.error("Vui lòng điền đầy đủ thông tin (bao gồm tỉnh, quận, địa chỉ)");
        setSubmitting(false);
        return;
      }

      if (cart.length === 0) {
        console.log("Cart is empty");
        toast.error("Giỏ hàng trống");
        setSubmitting(false);
        return;
      }

      console.log("Validation passed, cart items:", cart.length);

      // Validate: Check if all ordered items are available on delivery date
      const deliveryDate = new Date(orderInfo.deliveryDate);
      const deliveryDayName =
        deliveryDate.getDay() === 0 ? "Chủ Nhật" : DAYS_OF_WEEK[deliveryDate.getDay() - 1];
      const deliveryWeekId = getWeekIdentifier(deliveryDate);

      console.log("Delivery day:", deliveryDayName, "Week:", deliveryWeekId);

      // Get menu items for that day AND week
      const deliveryDayMenu = menuItems.filter(
        (item) => item.day === deliveryDayName && item.weekId === deliveryWeekId && item.available
      );

      console.log("Available menu items for delivery day:", deliveryDayMenu.length);

      const unavailableItems = cart.filter(
        (cartItem) => !deliveryDayMenu.some((menuItem) => menuItem.id === cartItem.menuItemId)
      );

      if (unavailableItems.length > 0) {
        console.log("Unavailable items:", unavailableItems);
        toast.error(
          `Một số món không có trong menu ngày ${deliveryDayName} (${new Date(orderInfo.deliveryDate).toLocaleDateString("vi-VN")}): ${unavailableItems.map((i) => i.name).join(", ")}. Vui lòng chọn lại món từ menu tuần này!`,
          { duration: 8000 }
        );
        setSubmitting(false);
        return;
      }

      // Validate cut-off time (2 hours minimum)
      const selectedDate = new Date(orderInfo.deliveryDate);
      const [startTime] = orderInfo.deliveryTime.split(" - ");
      const [hours, minutes] = startTime.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const diffInHours = (selectedDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      console.log("Time validation - hours until delivery:", diffInHours);

      if (diffInHours < 2) {
        console.log("Time validation failed");
        toast.error(
          `Vui lòng chọn thời gian giao hàng ít nhất 2 giờ kể từ bây giờ (còn ${diffInHours.toFixed(1)} giờ)`
        );
        setSubmitting(false);
        return;
      }

      const orderData = {
        customerName: orderInfo.customerName,
        phone: orderInfo.phone,
        address: orderInfo.address,
        deliveryDate: orderInfo.deliveryDate,
        deliveryTime: orderInfo.deliveryTime,
        notes: orderInfo.notes,
        items: cart.map((item) => ({
          id: item.menuItemId,
          name: item.name,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
        })),
        totalAmount: getTotalPrice(),
      };

      console.log("Sending order to API:", orderData);

      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/orders`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!data.success) {
        console.error("API returned success=false:", data.error);
        toast.error(`Lỗi khi tạo đơn hàng: ${data.error || "Vui lòng thử lại"}`);
        setSubmitting(false);
        return;
      }

      console.log("Order created successfully! Order number:", data.data.orderNumber);

      // Create order message
      const provinceName = provinces.find((p) => p.code === orderInfo.province)?.name || orderInfo.province;
      const districtName = districts[orderInfo.province]?.find((d) => d.code === orderInfo.district)?.name || orderInfo.district;
      const fullAddress = `${orderInfo.address}${orderInfo.ward ? `, ${orderInfo.ward}` : ""}, ${districtName}, ${provinceName}`;
      
      // Format date to dd/mm/yyyy
      const dateObj = new Date(orderInfo.deliveryDate);
      const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
      
      let message = `🌿 ĐƠN ĐẶT HÀNG - BẾP CHAY DÌ MUỘN\n\n`;
      message += `📋 Mã đơn: ${data.data.orderNumber}\n`;
      message += `👤 Tên: ${orderInfo.customerName}\n`;
      message += `📞 SĐT: ${orderInfo.phone}\n`;
      message += `📍 Địa chỉ: ${fullAddress}\n`;
      message += `📅 Ngày giao: ${formattedDate}\n`;
      message += `🕐 Giờ giao: ${orderInfo.deliveryTime}\n\n`;
      message += `🍽️ DANH SÁCH MÓN:\n`;

      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.selectedSize.name}) x${item.quantity} - ${formatPrice(item.selectedSize.price * item.quantity)}\n`;
      });

      message += `\n💰 TỔNG: ${formatPrice(getTotalPrice())}\n`;

      if (orderInfo.notes) {
        message += `\n📝 Ghi chú: ${orderInfo.notes}`;
      }

      console.log("Order message created, length:", message.length);

      // Try to copy to clipboard, but don't block the flow if permission is denied
      try {
        await navigator.clipboard.writeText(message);
        console.log("✓ Clipboard copy successful");
      } catch (err) {
        console.log("✗ Clipboard copy failed:", err);
      }

      setOrderMessage(message);
      console.log("Set order message state");
      
      toast.success(`Đơn hàng ${data.data.orderNumber} đã được tạo!`, {
        duration: 5000,
      });
      console.log("Showed success toast");

      // Reset states and show dialog immediately
      console.log("Resetting states...");
      setSubmitting(false);
      console.log("Set submitting = false");
      
      setOrderMessageDialog(true);
      console.log("Set orderMessageDialog = true - DIALOG SHOULD SHOW NOW!");
      
      setCheckoutOpen(false);
      console.log("Set checkoutOpen = false");
      
      setCart([]);
      console.log("Cleared cart");
      
      setOrderInfo({
        customerName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        deliveryDate: "",
        deliveryTime: "",
        notes: "",
      });
      console.log("Cleared order info");
      
      console.log("=== ORDER SUBMISSION COMPLETE ===");
    } catch (error) {
      console.error("=== ERROR IN ORDER SUBMISSION ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Full error:", error);
      toast.error(`Có lỗi xảy ra: ${error instanceof Error ? error.message : "Vui lòng thử lại"}`);
      setSubmitting(false);
      console.log("Set submitting = false after error");
    }
  };

  const dayMenu = useMemo(
    () => menuItems.filter((item) => item.day === selectedDay),
    [menuItems, selectedDay]
  );

  // Group by category - memoized
  const groupedMenu = useMemo(
    () =>
      dayMenu.reduce(
        (acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        },
        {} as Record<string, MenuItem[]>
      ),
    [dayMenu]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-4 flex items-center justify-center"
          >
            <img src={logo} alt="Dì Muộn" className="h-20 w-20 object-contain" />
          </motion.div>
          <p className="font-medium text-[#00554d]">Đang tải thực đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <motion.img
              src={logo}
              alt="Dì Muộn"
              className="h-10 md:h-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            />
            {/* Center Tagline */}
            <div className="hidden text-center md:block">
              <p className="text-sm font-medium text-[#00554d]">
                Món ngon từ rau củ quả đậu và nấm
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:0979637958"
                className="hidden items-center gap-2 text-sm text-[#00554d] hover:text-[#003d35] md:flex"
              >
                <Phone className="size-4" />
                <span>0979 637 958</span>
              </a>
              <Button
                onClick={() => setCartOpen(true)}
                className="relative bg-[#00554d] px-3 py-2 hover:bg-[#003d35]"
                size="sm"
              >
                <ShoppingCart className="size-4 md:mr-1.5" />
                <span className="hidden text-sm md:inline">Giỏ hàng</span>
                {cart.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner with Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Banner Image - No overlay text */}
        <div className="relative w-full">
          <img
            src={bannerImage}
            alt="Bếp Chay Dì Muộn Banner"
            className="h-auto max-h-[500px] w-full object-contain"
          />
        </div>
      </div>

      {/* Day Selector */}
      <div className="sticky top-[60px] z-30 border-b border-slate-200 bg-white/95 shadow-md backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          {/* Week Navigation */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <Button
              onClick={() => setWeekOffset(weekOffset - 1)}
              variant="outline"
              size="sm"
              className="border-[#00554d]/30 text-[#00554d] hover:bg-[#00554d]/5"
            >
              ← Tuần trước
            </Button>
            <div className="min-w-[200px] text-center">
              <p className="text-sm font-semibold text-[#00554d]">
                {weekOffset === 0
                  ? "Tuần này"
                  : weekOffset === 1
                    ? "Tuần sau"
                    : weekOffset === -1
                      ? "Tuần trước"
                      : `Tuần ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
              </p>
              <p className="text-xs font-medium text-slate-600">
                {getDateForDay(DAYS_OF_WEEK[0], weekOffset).getDate()}/
                {getDateForDay(DAYS_OF_WEEK[0], weekOffset).getMonth() + 1}/
                {getDateForDay(DAYS_OF_WEEK[0], weekOffset).getFullYear()}
                {" - "}
                {getDateForDay(DAYS_OF_WEEK[6], weekOffset).getDate()}/
                {getDateForDay(DAYS_OF_WEEK[6], weekOffset).getMonth() + 1}/
                {getDateForDay(DAYS_OF_WEEK[6], weekOffset).getFullYear()}
              </p>
              {weekOffset !== 0 && (
                <Button
                  onClick={() => setWeekOffset(0)}
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-6 px-2 text-xs text-[#00554d] hover:bg-[#00554d]/10"
                >
                  Về tuần này
                </Button>
              )}
            </div>
            <Button
              onClick={() => setWeekOffset(weekOffset + 1)}
              variant="outline"
              size="sm"
              className="border-[#00554d]/30 text-[#00554d] hover:bg-[#00554d]/5"
            >
              Tuần sau →
            </Button>
          </div>

          {/* Day Tabs */}
          <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-2 md:overflow-x-auto md:pb-2">
            {DAYS_OF_WEEK.map((day) => {
              const dayDate = getDateForDay(day, weekOffset);
              const isTodayDay = isToday(day, weekOffset);
              const isSelected = selectedDay === day;
              const lunarDay = isLunarSpecialDay(dayDate);

              return (
                <Button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  variant={isSelected ? "default" : "outline"}
                  className={`relative h-auto flex-col whitespace-nowrap py-2 text-xs md:min-w-[120px] md:py-3 md:text-sm ${
                    isSelected
                      ? "bg-[#00554d] text-white shadow-lg hover:bg-[#003d35]"
                      : lunarDay.isSpecial
                        ? "border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 hover:bg-amber-100"
                        : "border-slate-300 hover:bg-slate-100"
                  } ${isTodayDay && !isSelected ? "border-2 border-[#00554d] bg-[#00554d]/5" : ""} `}
                >
                  {isTodayDay && (
                    <motion.span
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Hôm nay
                    </motion.span>
                  )}
                  {lunarDay.isSpecial && !isTodayDay && (
                    <motion.span
                      className="absolute -right-1 -top-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {lunarDay.label}
                    </motion.span>
                  )}
                  <span className={isSelected ? "font-semibold" : ""}>{day}</span>
                  <span
                    className={`mt-1 text-xs ${isSelected ? "text-white/90" : lunarDay.isSpecial ? "font-medium text-amber-700" : "text-slate-500"}`}
                  >
                    {formatDate(dayDate)}
                  </span>
                  {lunarDay.isSpecial && (
                    <span
                      className={`mt-0.5 text-[10px] ${isSelected ? "text-white/80" : "font-semibold text-amber-600"}`}
                    >
                      {lunarDay.label}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Selected Day Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h2 className="mb-2 text-[#00554d]">Thực đơn {selectedDay}</h2>
          <p className="text-slate-600">
            {formatDate(getDateForDay(selectedDay, weekOffset))} •{" "}
            {weekOffset === 0
              ? "Tuần này"
              : weekOffset === 1
                ? "Tuần sau"
                : `Tuần ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
          </p>
          {isToday(selectedDay, weekOffset) && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00554d] to-[#007a6e] px-4 py-2 text-white shadow-lg"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
              </span>
              Menu hôm nay
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-10">
            {[1, 2].map((section) => (
              <div key={section}>
                <Skeleton className="mb-6 h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <Card key={item} className="overflow-hidden border-slate-200">
                      <Skeleton className="h-56 w-full" />
                      <CardHeader className="space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-10 w-28" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedMenu).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border-2 border-[#00554d]/10 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between border-b-2 border-[#00554d]/20 pb-3">
                  <h3 className="flex items-center gap-3 text-2xl font-bold text-[#00554d]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00554d]/10 to-[#00554d]/20 text-3xl">
                      {category === "Món Cuốn" && "🌯"}
                      {category === "Món dùng kèm Bánh Mì" && "🥖"}
                      {category === "Mì/ Bún/ Bánh canh" && "🍜"}
                      {category === "Mì/ Bún Xào" && "🍝"}
                      {category === "Nước uống" && "🥤"}
                      {!["Món Cuốn", "Món dùng kèm Bánh Mì", "Mì/ Bún/ Bánh canh", "Mì/ Bún Xào", "Nước uống"].includes(category) && "🍽️"}
                    </span>
                    <span>{category}</span>
                  </h3>
                  <Badge variant="secondary" className="bg-[#00554d]/10 px-4 py-1.5 text-base text-[#00554d]">
                    {items.length} món
                  </Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="group overflow-hidden border-slate-200 transition-all duration-300 hover:border-[#00554d]/30 hover:shadow-2xl"
                    >
                      {/* Always show image container */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        {item.imageUrl ? (
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          // Placeholder for missing images
                          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#00554d]/5 to-[#007a6e]/10">
                            <div className="mb-2 text-6xl">🍽️</div>
                            <p className="text-sm font-medium text-slate-500">Chưa có hình ảnh</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        {item.isSpecial && (
                          <motion.div
                            className="absolute right-3 top-3"
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-white shadow-lg">
                              ⭐ Đặc biệt
                            </Badge>
                          </motion.div>
                        )}
                        {!item.available && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <Badge variant="destructive" className="px-4 py-2 text-lg">
                              Hết hàng
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader className="space-y-2 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg font-semibold leading-tight text-[#00554d] transition-colors group-hover:text-[#007a6e]">
                            {item.name}
                          </CardTitle>
                          {item.available && (
                            <Badge
                              variant="outline"
                              className="shrink-0 border-emerald-600/30 bg-emerald-50 text-xs text-emerald-600"
                            >
                              ✓ Còn
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                          {item.description || "Món ăn chay ngon, dinh dưỡng từ rau củ quả tươi"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="flex flex-col">
                            <span className="mb-0.5 text-[10px] font-medium text-slate-500">
                              Giá
                            </span>
                            <span className="text-xl font-bold text-emerald-600">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <Button
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                            size="default"
                            className="bg-gradient-to-r from-emerald-600 to-green-600 text-sm text-white shadow-md transition-all duration-300 hover:from-emerald-700 hover:to-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Plus className="mr-1.5 size-4" />
                            Thêm
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden border-slate-200">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-5xl">🍽️</div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-700">Chưa có thực đơn</h3>
              <p className="text-base text-slate-500">
                Thực đơn cho {selectedDay} sẽ sớm được cập nhật
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Vui lòng chọn ngày khác hoặc quay lại sau
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00554d]">
              Thêm vào giỏ hàng
            </DialogTitle>
            <DialogDescription>Chọn số lượng và kích cỡ phần ăn</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-3 py-1">
              {/* Item Info */}
              <div className="flex gap-3 rounded-lg border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg shadow-md">
                  {selectedItem.imageUrl ? (
                    <ImageWithFallback
                      src={selectedItem.imageUrl}
                      alt={selectedItem.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                      <span className="text-3xl">🍽️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-base font-bold text-[#00554d]">{selectedItem.name}</h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {selectedItem.description}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    Giá gốc: {formatPrice(selectedItem.price)}
                  </p>
                </div>
              </div>

              {/* Size Options Selection */}
              {selectedItem.sizeOptions && selectedItem.sizeOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">Chọn phần ăn</Label>
                  <div className="grid gap-2">
                    {selectedItem.sizeOptions.map((option, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={selectedSize?.name === option.name ? "default" : "outline"}
                        onClick={() => setSelectedSize(option)}
                        className={`h-auto justify-between gap-2 py-3 text-left ${
                          selectedSize?.name === option.name
                            ? "border-2 border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                            : "border-2 border-slate-300 hover:border-emerald-400"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{option.name}</p>
                          <p className="text-xs opacity-90">Dành cho {option.servings} người</p>
                        </div>
                        <span className="text-lg font-bold">{formatPrice(option.price)}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">
                    Giá:{" "}
                    <span className="font-bold text-emerald-600">
                      {formatPrice(selectedItem.price)}
                    </span>
                  </p>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">Số lượng</Label>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="h-10 w-10 border-2 border-emerald-600 p-0 hover:bg-emerald-50"
                  >
                    <Minus className="size-4 text-emerald-600" />
                  </Button>
                  <span className="text-2xl font-bold text-emerald-600">{selectedQuantity}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="h-10 w-10 border-2 border-emerald-600 p-0 hover:bg-emerald-50"
                  >
                    <Plus className="size-4 text-emerald-600" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-800">Tổng cộng:</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {selectedSize && formatPrice(selectedSize.price * selectedQuantity)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={confirmAddToCart}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700"
                >
                  <Plus className="mr-2 size-4" />
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader className="border-b border-slate-200 pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#00554d]">
              <ShoppingCart className="size-5" />
              Giỏ hàng của bạn
            </SheetTitle>
            <SheetDescription className="text-sm">
              {cart.length === 0
                ? "Chưa có món nào"
                : `${cart.length} món - ${cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-green-50 shadow-inner">
                  <ShoppingCart className="size-12 text-emerald-300" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-slate-700">Giỏ hàng trống</h3>
                <p className="mb-1 text-sm text-slate-500">Thêm món để bắt đầu đặt hàng</p>
                <p className="text-xs text-slate-400">Chọn món yêu thích từ thực đơn</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 rounded-xl border-2 border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                    >
                      {/* Always show image or placeholder */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                        {item.imageUrl ? (
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-3xl">🍽️</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h4 className="text-[#00554d]">{item.name}</h4>
                          <Badge
                            variant="outline"
                            className="border-emerald-600 bg-emerald-50 text-emerald-700"
                          >
                            {item.selectedSize.name}
                          </Badge>
                        </div>
                        <p className="mb-1 text-xs text-slate-500">
                          Dành cho {item.selectedSize.servings} người
                        </p>
                        <p className="mb-2 font-semibold text-emerald-600">
                          {formatPrice(item.selectedSize.price)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 border-[#00554d]/30 p-0 hover:bg-[#00554d]/10"
                          >
                            <Minus className="size-4 text-[#00554d]" />
                          </Button>
                          <span className="w-10 text-center font-semibold text-[#00554d]">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 border-[#00554d]/30 p-0 hover:bg-[#00554d]/10"
                          >
                            <Plus className="size-4 text-[#00554d]" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto h-8 w-8 p-0"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="mt-4 rounded-xl border-t-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-medium text-slate-600">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 py-5 text-base font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-green-700 hover:shadow-lg"
                  >
                    <Send className="mr-2 size-5" />
                    Đặt hàng ngay
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Checkout Sheet */}
      <Sheet open={checkoutOpen} onOpenChange={(open: boolean) => {
        setCheckoutOpen(open);
        // Reset submitting state when opening checkout
        if (open) {
          setSubmitting(false);
        }
      }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-[#00554d]">Thông tin đặt hàng</SheetTitle>
            <SheetDescription>Điền đầy đủ thông tin để hoàn tất</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="customerName">Họ và tên *</Label>
              <Input
                id="customerName"
                value={orderInfo.customerName}
                onChange={(e) => setOrderInfo({ ...orderInfo, customerName: e.target.value })}
                placeholder="Nguyễn Văn A"
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
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="province">Tỉnh/TP *</Label>
                <Select
                  value={orderInfo.province}
                  onValueChange={(value: string) => {
                    setOrderInfo({ ...orderInfo, province: value, district: "", ward: "" });
                  }}
                  modal={false}
                >
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Chọn tỉnh/TP" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-[300px] overflow-y-auto">
                    {provinces.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="district">Quận/Huyện *</Label>
                <Select
                  value={orderInfo.district}
                  onValueChange={(value: string) => {
                    setOrderInfo({ ...orderInfo, district: value, ward: "" });
                  }}
                  disabled={!orderInfo.province}
                  modal={false}
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Chọn quận" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-[300px] overflow-y-auto">
                    {orderInfo.province &&
                      districts[orderInfo.province]?.map((d) => (
                        <SelectItem key={d.code} value={d.code}>
                          {d.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ward">Phường/Xã</Label>
                <Select
                  value={orderInfo.ward}
                  onValueChange={(value: string) => setOrderInfo({ ...orderInfo, ward: value })}
                  disabled={!orderInfo.district}
                  modal={false}
                >
                  <SelectTrigger id="ward">
                    <SelectValue placeholder="Chọn phường" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] max-h-[300px] overflow-y-auto">
                    {orderInfo.district &&
                      wards[orderInfo.district]?.map((w, idx) => (
                        <SelectItem key={idx} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Số nhà, tên đường *</Label>
              <Input
                id="address"
                value={orderInfo.address}
                onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                placeholder="VD: 123 Nguyễn Văn Linh"
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
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                />
                <p className="mt-1 text-xs text-slate-500">Tối đa 7 ngày</p>
              </div>

              <div>
                <Label htmlFor="deliveryTime">Giờ giao *</Label>
                <Select
                  value={orderInfo.deliveryTime}
                  onValueChange={(value: string) => setOrderInfo({ ...orderInfo, deliveryTime: value })}
                >
                  <SelectTrigger id="deliveryTime">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]" position="popper" sideOffset={5}>
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
                <p className="mt-1 text-xs text-amber-600">⚠️ Đặt trước 2 giờ</p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={orderInfo.notes}
                onChange={(e) => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                placeholder="Yêu cầu đặc biệt..."
                rows={2}
              />
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="mb-4 rounded-lg bg-slate-50 p-4">
                <h4 className="mb-2 text-[#00554d]">Tóm tắt đơn hàng</h4>
                {cart.map((item) => (
                  <div key={item.id} className="mb-1 flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.selectedSize.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold">
                  <span>Tổng:</span>
                  <span className="text-[#00554d]">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <Button
                onClick={submitOrder}
                disabled={submitting}
                className="w-full bg-[#00554d] hover:bg-[#003d35] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Gửi đơn hàng
                  </>
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-slate-500">
                💡 Đơn hàng sẽ được lưu và gửi qua Messenger
                <br />⏰ Phải đặt trước ít nhất 2 giờ
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Order Message Dialog */}
      <Dialog open={orderMessageDialog} onOpenChange={setOrderMessageDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>✅ Đơn hàng đã được tạo!</DialogTitle>
            <DialogDescription>
              Nhấn "Sao chép" rồi gửi qua Messenger hoặc Zalo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border max-h-[300px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">{orderMessage}</pre>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(orderMessage)
                    .then(() => toast.success("✅ Đã sao chép! Bạn có thể dán vào Messenger/Zalo"))
                    .catch(() => toast.error("Không thể sao chép. Vui lòng chọn và copy thủ công"));
                }}
                variant="outline"
                className="w-full"
              >
                📋 Sao chép đơn hàng
              </Button>
              <Button
                onClick={() => {
                  const facebookPageId = "61571985855948";
                  const encodedMessage = encodeURIComponent(orderMessage);
                  window.open(`https://m.me/${facebookPageId}?text=${encodedMessage}`, "_blank");
                  toast.info("📱 Đã mở Messenger. Nếu nội dung chưa có, hãy dán (paste) vào!");
                  setOrderMessageDialog(false);
                }}
                className="w-full"
              >
                💬 Mở Messenger
              </Button>
              <Button
                onClick={() => {
                  const phoneNumber = "0399691995";
                  window.open(`https://zalo.me/${phoneNumber}`, "_blank");
                  toast.info("📱 Đã mở Zalo. Vui lòng dán (paste) nội dung đơn hàng!");
                  setOrderMessageDialog(false);
                }}
                variant="outline"
                className="w-full"
              >
                📱 Mở Zalo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
