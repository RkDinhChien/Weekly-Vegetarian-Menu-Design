import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Edit, Trash2, Upload, BookOpen, Calendar, FolderOpen, Settings } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";

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
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

export function DishLibrary() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Category management states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: "", displayOrder: 1 });

  const [formData, setFormData] = useState<Partial<Dish>>({
    name: "",
    description: "",
    basePrice: undefined,
    category: "",
    imageUrl: "",
    sizeOptions: [],
  });

  useEffect(() => {
    Promise.all([fetchDishes(), fetchCategories()]);
  }, []);

  // Auto-update category when categories change
  useEffect(() => {
    if (categories.length > 0 && !editingDish) {
      // If no category set, use first one
      if (!formData.category) {
        console.log("Auto-setting category to:", categories[0].name);
        setFormData((prev) => ({ ...prev, category: categories[0].name }));
      } else {
        // Check if current category still exists
        const categoryExists = categories.some((c) => c.name === formData.category);
        if (!categoryExists) {
          console.log("Current category doesn't exist, setting to:", categories[0].name);
          setFormData((prev) => ({ ...prev, category: categories[0].name }));
        }
      }
    }
  }, [categories, editingDish]);

  // Force update when dialog opens
  useEffect(() => {
    if (dialogOpen && categories.length > 0 && !editingDish && !formData.category) {
      console.log("Dialog opened, setting category to:", categories[0].name);
      setFormData((prev) => ({ ...prev, category: categories[0].name }));
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
      console.log("Fetched dishes:", data);
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
      console.log("✅ Fetched categories:", data);
      if (data.success) {
        const newCategories = data.data;
        console.log(
          "📋 Categories list:",
          newCategories.map((c: Category) => c.name)
        );
        setCategories(newCategories);

        // Always update formData with first category if form is empty
        if (newCategories.length > 0) {
          console.log("🔄 Will update formData.category");
          setFormData((prev) => {
            // If editing, keep the current category
            if (editingDish) return prev;
            // If adding new and no category set, use first category
            if (!prev.category) return { ...prev, category: newCategories[0].name };
            // If current category doesn't exist in new list, reset to first
            const categoryExists = newCategories.some((c: Category) => c.name === prev.category);
            if (!categoryExists) return { ...prev, category: newCategories[0].name };
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Đổi tải danh mục");
    }
  };

  // Category Management Functions
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({ name: category.name, displayOrder: category.displayOrder });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: "", displayOrder: categories.length + 1 });
    }
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      toast.error("Vui lòng nhập tên nhóm");
      return;
    }

    try {
      const url = editingCategory
        ? `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/categories/${editingCategory.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/categories`;

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(categoryFormData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingCategory ? "Cập nhật nhóm thành công!" : "Thêm nhóm thành công!");
        setCategoryDialogOpen(false);
        setEditingCategory(null);
        setCategoryFormData({ name: "", displayOrder: 1 });
        await fetchCategories(); // Auto refresh
      } else {
        toast.error(`Lỗi: ${data.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Đã có món ăn dùng nhóm này. Bạn vẫn muốn xóa?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Xóa nhóm thành công");
        await fetchCategories(); // Auto refresh
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi xóa nhóm");
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

      const data = await response.json();
      console.log("Upload response:", data);
      if (data.success && data.imageUrl) {
        setUploadedImageUrl(data.imageUrl);
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        toast.success("Đã upload hình ảnh thành công!");
      } else {
        toast.error(`Lỗi upload: ${data.error || "Không có URL trả về"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Lỗi upload: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.basePrice || !formData.category) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const url = editingDish
        ? `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/dishes/${editingDish.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/dishes`;

      const payload = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        category: formData.category,
        imageUrl: uploadedImageUrl || formData.imageUrl || "",
        sizeOptions: sizeOptions.length > 0 ? sizeOptions : undefined,
      };

      const response = await fetch(url, {
        method: editingDish ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          editingDish ? "Cập nhật món thành công!" : "Thêm món vào thư viện thành công!"
        );
        setDialogOpen(false);
        resetForm();
        await fetchDishes();
      } else {
        toast.error(`Lỗi: ${data.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Error saving dish:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa món này khỏi thư viện?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/dishes/${id}`,
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
        fetchDishes();
      }
    } catch (error) {
      console.error("Error deleting dish:", error);
      toast.error("Lỗi xóa món");
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData(dish);
    setUploadedImageUrl(dish.imageUrl || "");
    setSizeOptions(dish.sizeOptions || []);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDish(null);
    setUploadedImageUrl("");
    setSizeOptions([]);

    // Get fresh categories
    const defaultCategory = categories.length > 0 ? categories[0].name : "";

    setFormData({
      name: "",
      description: "",
      basePrice: undefined,
      category: defaultCategory,
      imageUrl: "",
      sizeOptions: [],
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Group by category
  const groupedByCategory = categories.map((cat) => ({
    category: cat.name,
    dishes: dishes.filter((dish) => dish.category === cat.name),
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <BookOpen className="size-12 text-emerald-600" />
          </motion.div>
          <p className="text-lg font-semibold text-emerald-700">Đang tải thư viện món...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl">
              <BookOpen className="size-10 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-emerald-900 text-transparent">
                Thư Viện Món Ăn
              </h1>
              <p className="text-emerald-600">
                Quản lý danh sách tất cả các món - {dishes.length} món • {categories.length} nhóm
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => openCategoryDialog()}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <FolderOpen className="mr-2 size-5" />
              Quản lý Nhóm
            </Button>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg hover:from-emerald-700 hover:to-green-700"
            >
              <Plus className="mr-2 size-5" />
              Thêm Món Mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24 space-y-2">
            <div className="mb-4 rounded-lg border border-emerald-200 bg-white p-3 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <FolderOpen className="size-4" />
                Danh mục ({categories.length})
              </h3>
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const count = dishes.filter((d) => d.category === cat.name).length;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      const element = document.getElementById(`category-${cat.id}`);
                      element?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`w-full rounded-lg px-4 py-3 text-left transition-all ${
                      isSelected
                        ? "border-2 border-emerald-500 bg-emerald-100 font-semibold text-emerald-900 shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{cat.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isSelected ? "border-emerald-400 bg-emerald-200" : "bg-slate-100"
                        }`}
                      >
                        {count}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1">
          {/* Dialog for Add/Edit */}
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (open) {
                // Refresh categories when opening dialog
                fetchCategories().then(() => {
                  console.log("Categories after fetch:", categories);
                  console.log("Current formData.category:", formData.category);
                });
              } else {
                resetForm();
              }
            }}
          >
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-emerald-900">
                  {editingDish ? "Chỉnh sửa món" : "Thêm món vào thư viện"}
                </DialogTitle>
                <DialogDescription>
                  Điền thông tin món ăn. Sau khi lưu vào thư viện, bạn có thể thêm món này vào menu
                  theo ngày.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 p-4">
                  <div>
                    <Label htmlFor="name">Tên món *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Phở chay"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Nước dùng ngọt thanh từ hành củ..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basePrice">Giá cơ bản (VNĐ) *</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        value={formData.basePrice || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            basePrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        placeholder="45000"
                        min="0"
                        step="1000"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Loại món *</Label>
                      {categories.length > 0 ? (
                        <Select
                          key={categories.map((c) => c.id).join("-")}
                          value={formData.category}
                          onValueChange={(value) => {
                            console.log("Selected category:", value);
                            setFormData({ ...formData, category: value });
                          }}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Chọn loại món" />
                          </SelectTrigger>
                          <SelectContent className="z-[9999]">
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                          Chưa có nhóm món
                        </div>
                      )}
                      {categories.length === 0 ? (
                        <p className="mt-1 text-xs text-red-500">
                          ⚠️ Click "Quản lý Nhóm" để thêm nhóm món trước!
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-emerald-600">
                          ✓ {categories.length} nhóm • Hiện tại: {formData.category || "Chưa chọn"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Size Options */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <Label>Tùy chọn phần ăn (Không bắt buộc)</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newOption = {
                            name: `Phần ${sizeOptions.length + 1} người`,
                            servings: sizeOptions.length + 1,
                            price: formData.basePrice || 0,
                          };
                          setSizeOptions([...sizeOptions, newOption]);
                        }}
                      >
                        <Plus className="mr-1 size-4" />
                        Thêm tùy chọn
                      </Button>
                    </div>
                    {sizeOptions.length > 0 && (
                      <div className="space-y-2">
                        {sizeOptions.map((option, index) => (
                          <div key={index} className="flex items-end gap-2">
                            <div className="flex-1">
                              <Label className="text-xs">Tên (VD: Phần nhỏ)</Label>
                              <Input
                                placeholder="Phần 1 người"
                                value={option.name}
                                onChange={(e) => {
                                  const newOptions = [...sizeOptions];
                                  newOptions[index].name = e.target.value;
                                  setSizeOptions(newOptions);
                                }}
                              />
                            </div>
                            <div className="w-24">
                              <Label className="text-xs">Số người</Label>
                              <Input
                                type="number"
                                min="1"
                                value={option.servings}
                                onChange={(e) => {
                                  const newOptions = [...sizeOptions];
                                  newOptions[index].servings = Number(e.target.value);
                                  setSizeOptions(newOptions);
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Giá (VNĐ)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="45000"
                                value={option.price}
                                onChange={(e) => {
                                  const newOptions = [...sizeOptions];
                                  newOptions[index].price = Number(e.target.value);
                                  setSizeOptions(newOptions);
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-red-500"
                              onClick={() => {
                                setSizeOptions(sizeOptions.filter((_, i) => i !== index));
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      Nếu không thêm tùy chọn, giá cơ bản sẽ được sử dụng
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="image">Hình ảnh</Label>
                    <div className="space-y-3">
                      {/* URL input - collapsed by default */}
                      <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-emerald-600">
                          Hoặc dùng URL hình ảnh
                        </summary>
                        <div className="mt-2">
                          <Input
                            id="imageUrl"
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={formData.imageUrl || ""}
                            onChange={(e) => {
                              setFormData({ ...formData, imageUrl: e.target.value });
                              setUploadedImageUrl(e.target.value);
                            }}
                            className="text-sm"
                          />
                        </div>
                      </details>

                      {/* Upload button - prominent */}
                      <div className="relative">
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                        <label
                          htmlFor="image"
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-8 transition-colors hover:border-emerald-400 hover:bg-emerald-100 ${
                            uploadingImage ? "cursor-not-allowed opacity-50" : ""
                          }`}
                        >
                          {uploadingImage ? (
                            <>
                              <Upload className="size-5 animate-bounce text-emerald-600" />
                              <span className="font-medium text-emerald-700">Đang upload...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="size-5 text-emerald-600" />
                              <div className="text-center">
                                <p className="font-medium text-emerald-700">
                                  Click để chọn hình ảnh
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  hoặc kéo thả file vào đây (tối đa 5MB)
                                </p>
                              </div>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Preview */}
                    {(uploadedImageUrl || formData.imageUrl) && (
                      <div className="mt-3">
                        <div className="relative overflow-hidden rounded-xl border-2 border-emerald-200">
                          <ImageWithFallback
                            key={uploadedImageUrl || formData.imageUrl}
                            src={uploadedImageUrl || formData.imageUrl || ""}
                            alt="Preview"
                            className="h-48 w-full object-cover"
                          />
                          <div className="absolute right-2 top-2">
                            <Badge className="bg-green-500">✓ Đã upload</Badge>
                          </div>
                        </div>
                      </div>
                    )}
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
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    {editingDish ? "Cập nhật" : "Thêm vào thư viện"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dishes List by Category */}
          <div className="space-y-8">
            {groupedByCategory.map(({ category, dishes: categoryDishes }) => {
              const cat = categories.find((c) => c.name === category);
              return (
                <Card
                  key={category}
                  id={`category-${cat?.id}`}
                  className="scroll-mt-24 overflow-hidden border-emerald-100 shadow-md"
                >
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                    <CardTitle className="flex items-center justify-between text-emerald-900">
                      <span>{category}</span>
                      <Badge className="bg-emerald-600">{categoryDishes.length} món</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {categoryDishes.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categoryDishes.map((dish) => (
                          <Card
                            key={dish.id}
                            className="group overflow-hidden border-emerald-100 hover:shadow-lg"
                          >
                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                              {dish.imageUrl ? (
                                <ImageWithFallback
                                  src={dish.imageUrl}
                                  alt={dish.name}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <div className="text-center">
                                    <div className="mb-2 text-5xl">🍽️</div>
                                    <p className="text-xs text-emerald-600">Chưa có hình</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="mb-2 font-semibold text-emerald-900">{dish.name}</h3>
                              <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                                {dish.description}
                              </p>

                              {/* Display price or size options */}
                              {dish.sizeOptions && dish.sizeOptions.length > 0 ? (
                                <div className="mb-3 space-y-1">
                                  {dish.sizeOptions.map((option, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-slate-600">
                                        {option.name} ({option.servings} người)
                                      </span>
                                      <span className="font-semibold text-emerald-600">
                                        {formatPrice(option.price)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="mb-3 flex items-center justify-between">
                                  <span className="text-lg font-bold text-emerald-600">
                                    {formatPrice(dish.basePrice)}
                                  </span>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(dish)}
                                  className="flex-1 border-emerald-200 hover:bg-emerald-50"
                                >
                                  <Edit className="mr-1 size-4" />
                                  Sửa
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(dish.id)}
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="mr-1 size-4" />
                                  Xóa
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-500">
                        <p>Chưa có món nào trong danh mục này</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Management Dialog */}
      <Dialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) {
            setEditingCategory(null);
            setCategoryFormData({ name: "", displayOrder: 1 });
            fetchCategories(); // Refresh categories in main form
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-900">
              <FolderOpen className="size-5" />
              Quản lý Nhóm Món Ăn
            </DialogTitle>
            <DialogDescription>
              Tạo và quản lý các nhóm món ăn. Các nhóm này sẽ được dùng để phân loại món trong thư
              viện.
            </DialogDescription>
          </DialogHeader>

          {/* Add/Edit Category Form */}
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4">
              <h3 className="mb-3 font-semibold text-purple-900">
                {editingCategory ? "Chỉnh sửa nhóm" : "Thêm nhóm mới"}
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="categoryName">Tên nhóm *</Label>
                  <Input
                    id="categoryName"
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, name: e.target.value })
                    }
                    placeholder="Món cuốn, Món xào..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="1"
                    value={categoryFormData.displayOrder}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        displayOrder: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                {editingCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryFormData({ name: "", displayOrder: categories.length + 1 });
                    }}
                  >
                    Hủy chỉnh sửa
                  </Button>
                )}
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 size-4" />
                  {editingCategory ? "Cập nhật" : "Thêm nhóm"}
                </Button>
              </div>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700">Danh sách nhóm ({categories.length})</h3>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg border border-purple-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        #{category.displayOrder}
                      </Badge>
                      <span className="font-medium text-slate-800">{category.name}</span>
                      <span className="text-xs text-slate-500">
                        ({dishes.filter((d) => d.category === category.name).length} món)
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openCategoryDialog(category)}
                        className="h-8 px-2 text-purple-600 hover:bg-purple-50"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCategoryDelete(category.id)}
                        className="h-8 px-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <FolderOpen className="mx-auto mb-2 size-12 text-slate-400" />
                  <p>Chưa có nhóm nào</p>
                  <p className="text-sm">Thêm nhóm đầu tiên ở trên</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
