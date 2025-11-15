import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Get all menu items
app.get("/make-server-49570ec2/menu", async (c) => {
  try {
    const items = await kv.getByPrefix("menu:");
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get menu items by day
app.get("/make-server-49570ec2/menu/:day", async (c) => {
  try {
    const day = c.req.param("day");
    const allItems = await kv.getByPrefix("menu:");
    const dayItems = allItems.filter((item: any) => item.day === day);
    return c.json({ success: true, data: dayItems });
  } catch (error) {
    console.error("Error fetching menu by day:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add new menu item
app.post("/make-server-49570ec2/menu", async (c) => {
  try {
    const body = await c.req.json();
    const id = `menu:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log("Creating new menu item with data:", body);

    const menuItem = {
      id,
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      imageUrl: body.imageUrl || "",
      day: body.day,
      isSpecial: body.isSpecial || false,
      available: body.available !== false,
      sizeOptions: body.sizeOptions || [],
      dishId: body.dishId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Menu item to be saved:", menuItem);
    await kv.set(id, menuItem);
    console.log("Menu item created successfully:", id);

    return c.json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Error adding menu item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update menu item
app.put("/make-server-49570ec2/menu/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    console.log("Updating menu item:", id, "with data:", body);

    const existing = await kv.get(id);
    if (!existing) {
      console.error("Menu item not found:", id);
      return c.json({ success: false, error: "Menu item not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated item data:", updated);
    await kv.set(id, updated);

    console.log("Menu item updated successfully:", id);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete menu item
app.delete("/make-server-49570ec2/menu/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Upload image to Supabase Storage
app.post("/make-server-49570ec2/upload-image", async (c) => {
  try {
    const bucketName = "make-49570ec2-menu-images";

    // Create bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });

      if (createError) {
        console.error("Error creating bucket:", createError);
      }
    }

    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: "No file provided" }, 400);
    }

    // Sanitize filename: remove spaces and special characters
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9.-]/g, ""); // Remove special characters except dots and hyphens

    const fileName = `${Date.now()}-${sanitizedName}`;
    console.log("Uploading image:", file.name, "size:", file.size);

    const arrayBuffer = await file.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      return c.json({ success: false, error: uploadError.message }, 500);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    console.log("Upload successful! Image URL:", publicUrlData.publicUrl);

    return c.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Error in upload-image:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create new order
app.post("/make-server-49570ec2/orders", async (c) => {
  try {
    const body = await c.req.json();
    const id = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const order = {
      id,
      orderNumber: `#${Date.now().toString().slice(-6)}`,
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      deliveryDate: body.deliveryDate,
      deliveryTime: body.deliveryTime,
      notes: body.notes,
      items: body.items,
      totalAmount: body.totalAmount,
      status: "pending", // pending, confirmed, preparing, delivering, completed, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(id, order);

    // Send email notification (if email service is configured)
    // This is a placeholder - you would implement actual email sending here
    console.log("New order created:", order.orderNumber);

    return c.json({ success: true, data: order });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all orders
app.get("/make-server-49570ec2/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    // Sort by creation date, newest first
    orders.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update order status
app.put("/make-server-49570ec2/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existing = await kv.get(id);
    if (!existing) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(id, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete order
app.delete("/make-server-49570ec2/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ DISH LIBRARY ENDPOINTS ============

// Get all dishes from library
app.get("/make-server-49570ec2/dishes", async (c) => {
  try {
    const dishes = await kv.getByPrefix("dish:");
    // Sort by creation date, newest first
    dishes.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, data: dishes });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get dishes by category
app.get("/make-server-49570ec2/dishes/category/:category", async (c) => {
  try {
    const category = c.req.param("category");
    const allDishes = await kv.getByPrefix("dish:");
    const categoryDishes = allDishes.filter((dish: any) => dish.category === category);
    return c.json({ success: true, data: categoryDishes });
  } catch (error) {
    console.error("Error fetching dishes by category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add new dish to library
app.post("/make-server-49570ec2/dishes", async (c) => {
  try {
    const body = await c.req.json();
    const id = `dish:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log("Creating new dish with data:", body);

    const dish = {
      id,
      name: body.name,
      description: body.description,
      basePrice: body.basePrice,
      category: body.category,
      imageUrl: body.imageUrl || "",
      sizeOptions: body.sizeOptions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Dish to be saved:", dish);
    await kv.set(id, dish);
    console.log("Dish created successfully:", id);

    return c.json({ success: true, data: dish });
  } catch (error) {
    console.error("Error adding dish:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update dish in library
app.put("/make-server-49570ec2/dishes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    console.log("Updating dish:", id, "with data:", body);

    const existing = await kv.get(id);
    if (!existing) {
      console.error("Dish not found:", id);
      return c.json({ success: false, error: "Dish not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated dish data:", updated);
    await kv.set(id, updated);

    console.log("Dish updated successfully:", id);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating dish:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete dish from library
app.delete("/make-server-49570ec2/dishes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting dish:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ END DISH LIBRARY ENDPOINTS ============

// ============ CATEGORY ENDPOINTS ============

// Get all categories
app.get("/make-server-49570ec2/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    // Sort by displayOrder
    categories.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    return c.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add new category
app.post("/make-server-49570ec2/categories", async (c) => {
  try {
    const body = await c.req.json();
    const id = `category:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log("Creating new category with data:", body);

    const category = {
      id,
      name: body.name,
      displayOrder: body.displayOrder || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Category to be saved:", category);
    await kv.set(id, category);
    console.log("Category created successfully:", id);

    return c.json({ success: true, data: category });
  } catch (error) {
    console.error("Error adding category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update category
app.put("/make-server-49570ec2/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    console.log("Updating category:", id, "with data:", body);

    const existing = await kv.get(id);
    if (!existing) {
      console.error("Category not found:", id);
      return c.json({ success: false, error: "Category not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated category data:", updated);
    await kv.set(id, updated);

    console.log("Category updated successfully:", id);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete category
app.delete("/make-server-49570ec2/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============ END CATEGORY ENDPOINTS ============

// Seed initial data (optional - call once to populate sample data)
app.post("/make-server-49570ec2/seed-menu", async (c) => {
  try {
    const sampleMenuItems = [
      {
        name: "Phở chay",
        description: "Nước dùng ngọt thanh từ hành củ, nấm hương, đậu hũ non, rau thơm",
        price: 45000,
        category: "Món chính",
        imageUrl:
          "https://images.unsplash.com/photo-1511910849309-0dffb8785146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwcGhvJTIwc291cHxlbnwxfHx8fDE3NjI4ODI2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        day: "Thứ Hai",
        isSpecial: true,
        available: true,
      },
      {
        name: "Gỏi cuốn chay",
        description: "Bánh tráng cuốn rau củ tươi, nấm rơm, bún, kèm nước chấm đậu phộng",
        price: 35000,
        category: "Khai vị",
        imageUrl:
          "https://images.unsplash.com/photo-1595238734477-ae7f8a79ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwc3ByaW5nJTIwcm9sbHN8ZW58MXx8fHwxNzYyODgyNjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        day: "Thứ Hai",
        isSpecial: false,
        available: true,
      },
      {
        name: "Đậu hũ sốt cà chua",
        description: "Đậu hũ chiên giòn, sốt cà chua chua ngọt, hành tây, ớt chuông",
        price: 40000,
        category: "Món chính",
        imageUrl:
          "https://images.unsplash.com/photo-1681747941744-998d09f899fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2Z1JTIwZGlzaHxlbnwxfHx8fDE3NjI4ODI2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        day: "Thứ Hai",
        isSpecial: false,
        available: true,
      },
    ];

    for (const item of sampleMenuItems) {
      const id = `menu:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(id, {
        id,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return c.json({ success: true, message: "Sample menu seeded successfully" });
  } catch (error) {
    console.error("Error seeding menu:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
