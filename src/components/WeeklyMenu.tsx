import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trash2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { AddDishToMenu } from "./AddDishToMenu";
import { getWeekIdentifier, getMonday as getMondayHelper, getWeekDates as getWeekDatesHelper } from "../utils/weekHelpers";
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
  dishId?: string;
}

const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

// Hàm lấy ngày đầu tuần (Thứ Hai)
const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

// Hàm tính ngày trong tuần từ Thứ Hai
const getWeekDates = (startDate: Date) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Hàm kiểm tra ngày âm lịch đặc biệt
const getLunarInfo = (date: Date) => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const day = lunar.getDay();

  if (day === 1) return { isSpecial: true, label: "Mùng 1", type: "first" };
  if (day === 15) return { isSpecial: true, label: "Rằm", type: "full" };
  return { isSpecial: false, label: "", type: "" };
};

export function WeeklyMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(weekDays[0]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    setWeekDates(getWeekDates(currentWeekStart));
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeekStart]); // Refetch when week changes

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const weekId = getWeekIdentifier(currentWeekStart);
      console.log("🔍 Fetching menu for week:", weekId);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/menu`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📦 API Response:", data);

      if (data.success) {
        // Filter by weekId on client-side (until backend supports it)
        const filteredItems = data.data.filter((item: MenuItem) => 
          item.weekId === weekId || !item.weekId // Show items without weekId (legacy)
        );
        setMenuItems(filteredItems);
        console.log(`✅ Loaded ${filteredItems.length} items for week ${weekId}`);
        
        if (filteredItems.length === 0) {
          toast.info(`Chưa có món nào cho tuần ${weekId}`);
        }
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("❌ Error fetching menu:", error);
      toast.error(`Lỗi tải menu: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa món này khỏi menu?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/menu/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Xóa món thành công");
        fetchMenuItems();
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Lỗi xóa món");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Calendar className="size-12 text-emerald-600" />
          </motion.div>
          <p className="text-lg font-semibold text-emerald-700">Đang tải menu tuần...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 rounded-3xl border border-[#00554d]/20 bg-gradient-to-br from-[#00554d]/5 to-[#00554d]/10 p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#00554d] shadow-xl">
              <Calendar className="size-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#00554d]">Menu Tuần</h1>
              <div className="mt-1 flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(currentWeekStart);
                    newDate.setDate(newDate.getDate() - 7);
                    setCurrentWeekStart(newDate);
                  }}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <p className="font-semibold text-[#00554d]">
                  {weekDates.length > 0 && (
                    <>
                      {weekDates[0].getDate()}/{weekDates[0].getMonth() + 1}/
                      {weekDates[0].getFullYear()}
                      {" - "}
                      {weekDates[6].getDate()}/{weekDates[6].getMonth() + 1}/
                      {weekDates[6].getFullYear()}
                    </>
                  )}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newDate = new Date(currentWeekStart);
                    newDate.setDate(newDate.getDate() + 7);
                    setCurrentWeekStart(newDate);
                  }}
                  className="h-7 px-2"
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentWeekStart(getMonday(new Date()))}
                  className="h-7 px-3 text-xs"
                >
                  Tuần này
                </Button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                💡 Muốn tạo món mới? Vào{" "}
                <span className="font-semibold text-[#00554d]">Quản lý món ăn</span> để thêm món vào
                thư viện trước
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Day Tabs - Horizontal Navigation */}
      <div className="mb-8">
        <Card className="overflow-hidden border-2 border-[#00554d]/20 shadow-md">
          <CardContent className="p-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weekDays.map((day, index) => {
                const dayItems = menuItems.filter((item) => item.day === day);
                const isSelected = selectedDay === day;
                const date = weekDates[index];
                const lunarInfo = date
                  ? getLunarInfo(date)
                  : { isSpecial: false, label: "", type: "" };
                const isToday = date && new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative flex min-w-[140px] flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all ${
                      isSelected
                        ? "scale-105 border-[#00554d] bg-[#00554d] shadow-lg"
                        : lunarInfo.isSpecial
                          ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-500"
                          : "border-slate-200 bg-white hover:border-[#00554d]/30 hover:bg-[#00554d]/5"
                    }`}
                  >
                    {/* Ngày âm lịch đặc biệt */}
                    {lunarInfo.isSpecial && !isSelected && (
                      <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                        {lunarInfo.label}
                      </div>
                    )}

                    {/* Hôm nay */}
                    {isToday && (
                      <div className="absolute -left-2 -top-2 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                        Hôm nay
                      </div>
                    )}

                    <span
                      className={`text-base font-semibold ${
                        isSelected
                          ? "text-white"
                          : lunarInfo.isSpecial
                            ? "text-amber-700"
                            : "text-slate-700"
                      }`}
                    >
                      {day}
                    </span>

                    {date && (
                      <span
                        className={`text-xs font-medium ${
                          isSelected
                            ? "text-white/90"
                            : lunarInfo.isSpecial
                              ? "text-amber-600"
                              : "text-slate-500"
                        }`}
                      >
                        {date.getDate()}/{date.getMonth() + 1}
                      </span>
                    )}

                    <div
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : lunarInfo.isSpecial
                            ? "bg-amber-100 text-amber-700"
                            : "bg-[#00554d]/10 text-[#00554d]"
                      }`}
                    >
                      <Calendar className="size-3" />
                      <span>{dayItems.length} món</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Day Content */}
      <div>
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-[#00554d]/20 bg-gradient-to-b from-white to-[#00554d]/5 shadow-lg">
            <CardHeader className="bg-[#00554d] text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{selectedDay}</span>
                  <Badge variant="secondary" className="bg-white/20 px-4 py-1 text-base text-white">
                    {menuItems.filter((item) => item.day === selectedDay).length} món
                  </Badge>
                </div>
                <AddDishToMenu 
                  onSuccess={fetchMenuItems} 
                  defaultDay={selectedDay}
                  currentWeekStart={currentWeekStart}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.filter((item) => item.day === selectedDay).length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                      <Calendar className="size-12 text-slate-400" />
                    </div>
                    <p className="text-lg font-semibold text-slate-600">Chưa có món nào</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Click "Thêm từ Thư Viện" để thêm món cho {selectedDay}
                    </p>
                  </div>
                ) : (
                  menuItems
                    .filter((item) => item.day === selectedDay)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md"
                      >
                        {item.imageUrl && (
                          <div className="mb-2 overflow-hidden rounded-lg">
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        )}
                        <h4 className="mb-1 font-semibold text-emerald-900">
                          {item.name}
                          {item.isSpecial && <span className="ml-2 text-xs">⭐</span>}
                        </h4>
                        <p className="mb-2 line-clamp-2 text-xs text-slate-600">
                          {item.description}
                        </p>

                        {/* All Size Options */}
                        {item.sizeOptions && item.sizeOptions.length > 0 ? (
                          <div className="mb-2 space-y-1">
                            {item.sizeOptions.map((option, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-md bg-emerald-50 px-2 py-1"
                              >
                                <span className="text-xs text-emerald-700">
                                  <span className="font-semibold">{option.name}</span>
                                  <span className="text-slate-600"> • {option.servings} người</span>
                                </span>
                                <span className="text-xs font-bold text-emerald-600">
                                  {formatPrice(option.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mb-2 flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-sm font-bold text-emerald-600">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        )}

                        {item.sizeOptions && item.sizeOptions.length > 0 && (
                          <div className="mb-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        )}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 flex-1 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="mr-1 size-3" />
                            Xóa
                          </Button>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
