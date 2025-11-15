import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, BookOpen, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { getWeekIdentifier, getMonday } from "../utils/weekHelpers";

interface SizeOption {
  name: string;
  servings: number;
  price: number;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl: string;
  sizeOptions?: SizeOption[];
}

interface AddDishToMenuProps {
  onSuccess: () => void;
  defaultDay?: string;
  currentWeekStart: Date;
}

const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

export function AddDishToMenu({ onSuccess, defaultDay, currentWeekStart }: AddDishToMenuProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(defaultDay || "Thứ Hai");
  const [isSpecial, setIsSpecial] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (defaultDay) {
      setSelectedDay(defaultDay);
    }
  }, [defaultDay]);

  useEffect(() => {
    if (dialogOpen) {
      fetchDishes();
    }
  }, [dialogOpen]);

  const fetchDishes = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/dishes`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setDishes(data.data);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      toast.error("Lỗi tải thư viện món");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDish = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleAddToMenu = async () => {
    if (!selectedDish) {
      toast.error("Vui lòng chọn món");
      return;
    }

    try {
      const weekId = getWeekIdentifier(currentWeekStart);
      
      const payload = {
        name: selectedDish.name,
        description: selectedDish.description,
        price: selectedDish.basePrice,
        category: selectedDish.category,
        imageUrl: selectedDish.imageUrl,
        day: selectedDay,
        weekId: weekId, // Add week identifier
        isSpecial: isSpecial,
        available: true,
        dishId: selectedDish.id,
        sizeOptions: selectedDish.sizeOptions || [],
      };

      console.log("Adding dish to menu with payload:", payload);
      console.log("Week ID:", weekId);
      console.log("Size options count:", payload.sizeOptions.length);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(`Đã thêm "${selectedDish.name}" vào menu ${selectedDay}`);
        setDialogOpen(false);
        resetForm();
        onSuccess();
      } else {
        toast.error(`Lỗi: ${data.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Error adding to menu:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const resetForm = () => {
    setSelectedDish(null);
    setSelectedDay("Thứ Hai");
    setIsSpecial(false);
    setSearchTerm("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="bg-white font-semibold text-[#00554d] shadow-lg hover:bg-white/90"
      >
        <Plus className="mr-2 size-5" />
        Thêm món
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#00554d]">
              <BookOpen className="size-5" />
              Thêm món từ Thư Viện
            </DialogTitle>
            <DialogDescription>Chọn món từ thư viện và thêm vào menu theo ngày</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <Label htmlFor="search">Tìm kiếm món</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên món hoặc loại món..."
              />
            </div>

            {/* Dish Selection */}
            <div>
              <Label>Chọn món ({filteredDishes.length} món)</Label>
              <div className="mt-2 grid max-h-96 gap-3 overflow-y-auto rounded-xl border border-[#00554d]/20 bg-gradient-to-br from-[#00554d]/5 to-[#00554d]/10 p-4 md:grid-cols-2">
                {loading ? (
                  <p className="col-span-2 py-8 text-center text-slate-500">Đang tải...</p>
                ) : filteredDishes.length > 0 ? (
                  filteredDishes.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => handleSelectDish(dish)}
                      className={`rounded-lg border-2 p-3 text-left transition-all hover:shadow-md ${
                        selectedDish?.id === dish.id
                          ? "border-[#00554d] bg-[#00554d]/10"
                          : "border-slate-200 bg-white hover:border-[#00554d]/30"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          {dish.imageUrl ? (
                            <ImageWithFallback
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00554d]/20 to-[#00554d]/30 text-2xl">
                              🍽️
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#00554d]">{dish.name}</h4>
                          <p className="line-clamp-1 text-xs text-slate-600">{dish.description}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {dish.category}
                            </Badge>
                            <span className="text-sm font-semibold text-[#00554d]">
                              {formatPrice(dish.basePrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                      <BookOpen className="size-12 text-slate-400" />
                    </div>
                    <p className="mb-2 text-lg font-semibold text-slate-700">
                      {searchTerm ? "Không tìm thấy món nào" : "Thư viện trống"}
                    </p>
                    <p className="mb-4 text-sm text-slate-500">
                      {searchTerm
                        ? "Thử tìm kiếm với từ khóa khác"
                        : "Chưa có món nào trong thư viện"}
                    </p>
                    {!searchTerm && (
                      <div className="rounded-lg bg-amber-50 p-4 text-left">
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">💡 Hướng dẫn:</span> Để thêm món vào menu,
                          bạn cần tạo món trong
                          <span className="font-semibold"> Quản lý món ăn</span> trước. Sau đó quay
                          lại đây để chọn món từ thư viện.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Configuration when dish is selected */}
            {selectedDish && (
              <div className="space-y-4 rounded-xl border-2 border-[#00554d]/30 bg-gradient-to-br from-[#00554d]/5 to-[#00554d]/10 p-4">
                <div className="flex items-center gap-3 border-b border-[#00554d]/20 pb-3">
                  <Calendar className="size-5 text-[#00554d]" />
                  <h3 className="font-semibold text-[#00554d]">
                    Cấu hình món: {selectedDish.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="day">Ngày trong tuần *</Label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weekDays.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Show size options preview */}
                  {selectedDish.sizeOptions && selectedDish.sizeOptions.length > 0 ? (
                    <div className="rounded-lg border border-[#00554d]/20 bg-[#00554d]/10 p-3">
                      <p className="mb-2 text-sm font-semibold text-[#00554d]">
                        ✓ Các phần ăn sẽ được thêm:
                      </p>
                      <div className="space-y-1">
                        {selectedDish.sizeOptions.map((option, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">
                              {option.name} ({option.servings} người)
                            </span>
                            <span className="font-semibold text-[#00554d]">
                              {formatPrice(option.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-sm text-amber-800">
                        ⚠️ Món này chưa có tùy chọn phần ăn. Chỉ hiển thị giá gốc:{" "}
                        {formatPrice(selectedDish.basePrice)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#00554d]/20 bg-white p-3">
                  <div>
                    <Label htmlFor="isSpecial" className="cursor-pointer">
                      Món đặc biệt
                    </Label>
                    <p className="text-xs text-slate-600">Hiển thị badge "Đặc biệt"</p>
                  </div>
                  <Switch id="isSpecial" checked={isSpecial} onCheckedChange={setIsSpecial} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddToMenu}
                disabled={!selectedDish}
                className="bg-[#00554d] hover:bg-[#00554d]/90"
              >
                <Plus className="mr-2 size-4" />
                Thêm vào Menu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
