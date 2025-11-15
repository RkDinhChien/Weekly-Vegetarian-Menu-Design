import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Leaf, Star } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logo from "figma:asset/da0287e4ba0aca17a7f033d98e20aceb35365d22.png";
import { projectId, publicAnonKey } from "../utils/supabase/info";

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
  isSpecial: boolean;
  available: boolean;
  sizeOptions?: SizeOption[];
}

const categoryColors: Record<string, string> = {
  "Khai vị": "bg-amber-100 text-amber-800 border-amber-300",
  "Món chính": "bg-green-100 text-green-800 border-green-300",
  Canh: "bg-blue-100 text-blue-800 border-blue-300",
  "Tráng miệng": "bg-pink-100 text-pink-800 border-pink-300",
  "Đồ uống": "bg-purple-100 text-purple-800 border-purple-300",
};

const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

export function CustomerMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMenuByDay = (day: string) => {
    return menuItems.filter((item) => item.day === day && item.available);
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
          <Leaf className="mx-auto mb-4 size-12 animate-spin text-green-600" />
          <p className="text-green-700">Đang tải thực đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-12 text-center"
      >
        {/* Decorative gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-200/40 via-emerald-200/40 to-teal-200/40 blur-3xl"
          />
        </div>

        {/* Logo with animations */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-6 inline-block"
        >
          {/* Glow effect */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(16, 185, 129, 0.3)",
                "0 0 40px rgba(16, 185, 129, 0.5)",
                "0 0 20px rgba(16, 185, 129, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl"
          />

          <motion.img
            src={logo}
            alt="Bếp Chay Dì Muộn"
            className="relative z-10 mx-auto h-32 w-auto drop-shadow-2xl md:h-40"
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Animated title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="mb-3 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text text-green-800 text-transparent">
            Thực Đơn Tuần
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mb-4 h-1 max-w-md bg-gradient-to-r from-transparent via-green-500 to-transparent"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto max-w-2xl text-green-700"
        >
          Menu đa dạng, bổ dưỡng mỗi ngày. Chúng tôi cam kết sử dụng 100% nguyên liệu thực vật tươi
          ngon, không chất bảo quản.
        </motion.p>

        {/* Decorative leaves */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-0 top-0 text-green-400/30"
        >
          <Leaf className="size-16" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute right-0 top-0 text-emerald-400/30"
        >
          <Leaf className="size-16" />
        </motion.div>
      </motion.div>

      {/* Weekly Menu Tabs */}
      <Tabs defaultValue="Thứ Hai" className="w-full">
        <TabsList className="mb-8 grid h-auto w-full grid-cols-7 border-2 border-green-200 bg-white/80 backdrop-blur-sm">
          {weekDays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="flex flex-col gap-1 py-3 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <span className="text-xs md:text-sm">{day}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {weekDays.map((day) => {
          const dayMenu = getMenuByDay(day);

          return (
            <TabsContent key={day} value={day} className="space-y-6">
              {/* Day Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Leaf className="size-6" />
                      </motion.div>
                      {day}
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      {dayMenu.length} món có sẵn
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Dishes Grid */}
              {dayMenu.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {dayMenu.map((dish, index) => (
                    <motion.div
                      key={dish.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      <Card
                        className={`h-full overflow-hidden transition-all hover:shadow-2xl ${
                          dish.isSpecial
                            ? "border-2 border-green-400 bg-green-50/50 shadow-lg shadow-green-200/50"
                            : "hover:border-green-300"
                        }`}
                      >
                        {/* Dish Image */}
                        {dish.imageUrl && (
                          <motion.div
                            className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ImageWithFallback
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                            />
                            {dish.isSpecial && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-3 rounded-full bg-amber-500 p-2 text-white shadow-lg"
                              >
                                <Star className="size-5" fill="currentColor" />
                              </motion.div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </motion.div>
                        )}

                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-green-900">{dish.name}</CardTitle>
                            <Badge className={categoryColors[dish.category] || "bg-gray-100"}>
                              {dish.category}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-700">
                            {dish.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {/* Size Options */}
                          {dish.sizeOptions && dish.sizeOptions.length > 0 ? (
                            <div className="space-y-2">
                              <p className="mb-2 text-xs font-semibold text-green-800">
                                Các lựa chọn phần ăn:
                              </p>
                              {dish.sizeOptions.map((option, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2"
                                >
                                  <div>
                                    <p className="font-semibold text-green-900">{option.name}</p>
                                    <p className="text-xs text-gray-600">
                                      Dành cho {option.servings} người
                                    </p>
                                  </div>
                                  <span className="text-lg font-bold text-green-700">
                                    {formatPrice(option.price)}
                                  </span>
                                </div>
                              ))}
                              {dish.isSpecial && (
                                <Badge
                                  variant="outline"
                                  className="mt-2 border-amber-400 text-amber-700"
                                >
                                  ⭐ Đặc biệt
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <motion.div className="text-green-700" whileHover={{ scale: 1.1 }}>
                                <span className="text-xs text-gray-500">Giá:</span>
                                <p className="text-2xl font-bold text-green-900">
                                  {formatPrice(dish.price)}
                                </p>
                              </motion.div>
                              {dish.isSpecial && (
                                <Badge
                                  variant="outline"
                                  className="border-amber-400 text-amber-700"
                                >
                                  ⭐ Đặc biệt
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center">
                    <Leaf className="mx-auto mb-4 size-12 text-gray-400" />
                    <p className="text-gray-500">Chưa có món nào cho {day}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 space-y-2 text-center text-gray-600"
      >
        <p>★ Món đặc biệt - Món được khách hàng yêu thích nhất</p>
        <p className="flex items-center justify-center gap-2">
          <Leaf className="size-4 text-green-600" />
          100% Thực vật - Không chất bảo quản - Tươi mỗi ngày
        </p>
      </motion.div>
    </div>
  );
}
