import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload, RefreshCw, Lock } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { supabaseConfig } from "@/lib/supabase/client";
const { projectId, anonKey: publicAnonKey } = supabaseConfig;
import logo from "figma:asset/9c86d23f18fc72c44e1d78d8a22180272cd5d4f6.png";
import { AddDishToMenu } from "./AddDishToMenu";

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

interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

export function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: undefined,
    category: "",
    imageUrl: "",
    day: "Thứ Hai",
    isSpecial: false,
    available: true,
  });

  useEffect(() => {
    Promise.all([fetchMenu(), fetchCategories()]);
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
      console.log("Fetched menu data:", data);
      if (data.success) {
        console.log("Menu items with imageUrls:", data.data.map((item: MenuItem) => ({
          name: item.name,
          imageUrl: item.imageUrl
        })));
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast.error("Lỗi tải menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/categories`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched categories:", data);
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data.data[0].name }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Lỗi tải danh mục");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file phải nhỏ hơn 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      console.log("Uploading image:", file.name, "size:", file.size);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formDataUpload,
        }
      );

      console.log("Upload response status:", response.status);
      const data = await response.json();
      console.log("Upload response data:", data);

      if (data.success && data.imageUrl) {
        const newImageUrl = data.imageUrl;
        console.log("Upload successful! Image URL:", newImageUrl);
        setUploadedImageUrl(newImageUrl);
        setFormData((prev) => {
          const updated = { ...prev, imageUrl: newImageUrl };
          console.log("FormData updated with imageUrl:", updated);
          return updated;
        });
        toast.success("Đã upload hình ảnh thành công!");
      } else {
        toast.error(`Lỗi upload: ${data.error || "Không có URL trả về"}`);
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Lỗi upload hình ảnh: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.day
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const url = editingItem
        ? `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/menu/${editingItem.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/menu`;

      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        imageUrl: uploadedImageUrl || formData.imageUrl || "",
        day: formData.day,
        isSpecial: formData.isSpecial || false,
        available: formData.available !== false,
      };

      console.log(editingItem ? "Updating item:" : "Creating item:", payload);
      console.log("Current uploadedImageUrl:", uploadedImageUrl);
      console.log("Current formData.imageUrl:", formData.imageUrl);

      const response = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        toast.success(editingItem ? "Cập nhật thành công!" : "Thêm món thành công!");
        setDialogOpen(false);
        resetForm();
        await fetchMenu(); // Wait for menu to refresh
      } else {
        toast.error(`Lỗi: ${data.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error(`Lỗi lưu dữ liệu: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa món này?")) return;

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
        fetchMenu();
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Lỗi xóa món");
    }
  };

  const handleEdit = (item: MenuItem) => {
    console.log("Editing item:", item);
    console.log("Item imageUrl:", item.imageUrl);
    setEditingItem(item);
    setFormData(item);
    setUploadedImageUrl(item.imageUrl || "");
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setUploadedImageUrl("");
    setFormData({
      name: "",
      description: "",
      price: undefined,
      category: categories.length > 0 ? categories[0].name : "",
      imageUrl: "",
      day: "Thứ Hai",
      isSpecial: false,
      available: true,
    });
  };

  const seedSampleData = async () => {
    if (!confirm("Bạn có muốn thêm dữ liệu mẫu không?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/seed-menu`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Thêm dữ liệu mẫu thành công");
        fetchMenu();
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Lỗi thêm dữ liệu mẫu");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const groupedByDay = weekDays.map((day) => ({
    day,
    items: menuItems.filter((item) => item.day === day),
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-4 flex items-center justify-center"
          >
            <img src={logo} alt="Dì Muộn" className="h-24 w-24 object-contain" />
          </motion.div>
          <p className="text-lg font-semibold text-blue-700">Đang tải dữ liệu quản lý...</p>
          <p className="mt-2 text-sm text-blue-500">Vui lòng đợi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        {/* Header Section - Improved */}
        <div className="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl">
                <Lock className="size-10 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-blue-900 text-transparent">
                  Quản Lý Menu
                </h1>
                <p className="text-blue-600">Thêm, sửa, xóa món ăn trong menu tuần</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={seedSampleData}
                variant="outline"
                className="border-blue-200 hover:border-blue-300 hover:bg-blue-50"
              >
                <RefreshCw className="mr-2 size-5" />
                Dữ Liệu Mẫu
              </Button>
              <AddDishToMenu onSuccess={fetchMenu} />
              <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
                    <Plus className="mr-2 size-5" />
                    Thêm Món Mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-blue-900">
                      {editingItem ? "Chỉnh sửa món" : "Thêm món mới"}
                    </DialogTitle>
                    <DialogDescription>Điền thông tin món ăn vào form bên dưới</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-4">
                      <div>
                        <Label htmlFor="name" className="text-blue-900">
                          Tên món *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Phở chay"
                          className="border-blue-200 focus:border-blue-400"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-blue-900">
                          Mô tả *
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Nước dùng ngọt thanh từ hành củ..."
                          rows={3}
                          className="border-blue-200 focus:border-blue-400"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price" className="text-blue-900">
                            Giá (VNĐ) *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            placeholder="45000"
                            min="0"
                            step="1000"
                            className="border-blue-200 focus:border-blue-400"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category" className="text-blue-900">
                            Loại món *
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                            required
                          >
                            <SelectTrigger className="border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Chọn loại món" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {categories.length === 0 && (
                            <p className="mt-1 text-xs text-red-500">
                              Chưa có nhóm món. Vui lòng vào tab "Nhóm Món" để tạo!
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="day" className="text-blue-900">
                          Ngày trong tuần *
                        </Label>
                        <Select
                          value={formData.day}
                          onValueChange={(value) => setFormData({ ...formData, day: value })}
                          required
                        >
                          <SelectTrigger className="border-blue-200 focus:border-blue-400">
                            <SelectValue placeholder="Chọn ngày" />
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

                      <div>
                        <Label htmlFor="image" className="text-blue-900">
                          Hình ảnh
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="border-blue-200 focus:border-blue-400"
                          />
                          {uploadingImage && (
                            <span className="flex items-center gap-2 text-sm text-blue-600">
                              <Upload className="size-4 animate-bounce" />
                              Đang upload...
                            </span>
                          )}
                        </div>
                        {uploadedImageUrl && (
                          <div className="mt-2">
                            <p className="mb-2 text-xs text-slate-600">URL hiện tại:</p>
                            <p className="mb-2 break-all rounded bg-slate-100 p-2 text-xs text-slate-700">{uploadedImageUrl}</p>
                          </div>
                        )}
                        {uploadedImageUrl && (
                          <div className="relative mt-3 overflow-hidden rounded-xl border-2 border-blue-200">
                            <ImageWithFallback
                              src={uploadedImageUrl}
                              alt="Preview"
                              className="h-48 w-full object-cover"
                            />
                            <div className="absolute right-2 top-2">
                              <Badge className="bg-green-500">✓ Đã upload</Badge>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-blue-200 pt-4">
                        <div className="flex items-center space-x-2 rounded-lg bg-amber-50 px-4 py-2">
                          <Switch
                            id="isSpecial"
                            checked={formData.isSpecial}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isSpecial: checked })
                            }
                          />
                          <Label htmlFor="isSpecial" className="cursor-pointer text-amber-900">
                            ⭐ Món đặc biệt
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 rounded-lg bg-green-50 px-4 py-2">
                          <Switch
                            id="available"
                            checked={formData.available}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, available: checked })
                            }
                          />
                          <Label htmlFor="available" className="cursor-pointer text-green-900">
                            ✓ Có sẵn
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
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
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {editingItem ? "Cập nhật" : "Thêm món"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Menu Items by Day */}
        <div className="space-y-6">
          {groupedByDay.map(({ day, items }) => (
            <Card
              key={day}
              className="overflow-hidden border-blue-200 shadow-lg transition-all hover:shadow-xl"
            >
              <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-blue-900">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm text-white">
                      {items.length}
                    </div>
                    {day}
                  </span>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    {items.length} món
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {items.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-blue-100 transition-all hover:shadow-lg"
                      >
                        {/* Always show image container */}
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                          {item.imageUrl ? (
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="text-center">
                                <div className="mb-2 text-5xl">🍽️</div>
                                <p className="text-xs text-blue-600">Chưa có hình ảnh</p>
                              </div>
                            </div>
                          )}
                          {!item.available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                              <Badge variant="destructive" className="px-4 py-2 text-lg">
                                Hết hàng
                              </Badge>
                            </div>
                          )}
                          {item.isSpecial && (
                            <div className="absolute right-3 top-3">
                              <Badge className="bg-amber-500 text-white shadow-lg">
                                ⭐ Đặc biệt
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-2 text-blue-900">{item.name}</h3>
                              <Badge className="mb-2 border-blue-200 bg-blue-100 text-xs text-blue-700">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between border-t border-blue-100 pt-3">
                            <span className="text-blue-700">{formatPrice(item.price)}</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item)}
                                className="border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(item.id)}
                                className="hover:bg-red-600"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-gray-50 to-blue-50 py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                      <Plus className="size-8 text-blue-400" />
                    </div>
                    <p className="mb-3 text-gray-500">Chưa có món nào cho {day}</p>
                    <Button
                      onClick={() => {
                        setFormData({ ...formData, day });
                        setDialogOpen(true);
                      }}
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="mr-2 size-4" />
                      Thêm món cho {day}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
