import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { supabaseConfig } from "@/lib/supabase/client";
const { projectId, anonKey: publicAnonKey } = supabaseConfig;

interface Category {
  id: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    displayOrder: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên nhóm món");
      return;
    }

    try {
      const url = editingCategory
        ? `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/categories/${editingCategory.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/categories`;

      const payload = {
        name: formData.name.trim(),
        displayOrder: formData.displayOrder,
      };

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingCategory ? "Cập nhật nhóm món thành công!" : "Thêm nhóm món thành công!");
        setDialogOpen(false);
        resetForm();
        await fetchCategories();
      } else {
        toast.error(`Lỗi: ${data.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa nhóm món này? Các món trong nhóm sẽ không bị xóa.")) return;

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
        toast.success("Xóa nhóm món thành công");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi xóa nhóm món");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      displayOrder: category.displayOrder,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      displayOrder: 1,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
            <FolderOpen className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Quản Lý Nhóm Món</h2>
            <p className="text-purple-600">Tạo và quản lý các danh mục món ăn - {categories.length} nhóm</p>
          </div>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 size-5" />
          Thêm Nhóm Mới
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-purple-900">
              {editingCategory ? "Chỉnh sửa nhóm món" : "Thêm nhóm món mới"}
            </DialogTitle>
            <DialogDescription>
              Nhóm món giúp phân loại các món ăn dễ dàng hơn
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
              <div>
                <Label htmlFor="name">Tên nhóm món *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Món Nướng, Món Hấp, Món Chiên..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: Number(e.target.value) })
                  }
                  placeholder="1"
                  min="1"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Số nhỏ sẽ hiển thị trước (1, 2, 3...)
                </p>
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {editingCategory ? "Cập nhật" : "Thêm nhóm"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories List */}
      <Card className="border-purple-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-purple-900">
            Danh sách nhóm món ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {categories.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="overflow-hidden border-purple-100 transition-all hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-purple-900">{category.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          Thứ tự: {category.displayOrder}
                        </Badge>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 text-2xl">
                        📁
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        className="flex-1 border-purple-200 hover:bg-purple-50"
                      >
                        <Edit className="mr-1 size-4" />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
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
            <div className="py-12 text-center text-slate-500">
              <FolderOpen className="mx-auto mb-4 size-16 text-slate-300" />
              <p className="mb-2 text-lg font-semibold">Chưa có nhóm món nào</p>
              <p className="text-sm">Bấm nút "Thêm Nhóm Mới" để tạo nhóm món đầu tiên</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
