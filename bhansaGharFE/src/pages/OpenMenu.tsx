import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FoodItemCard } from "@/components/section-cards";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCategories, getFoodItems } from "@/services/menu";
import { FoodCategory, FoodItem } from "@/interfaces/MenuInterfaces";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OpenMenu() {
  const { tableId } = useParams<{ tableId: string }>();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFoodItems();
  }, []);

  async function fetchCategories() {
    try {
      const response: ApiResponse = await getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch categories", {
        description: error.message,
      });
    }
  }

  async function fetchFoodItems() {
    try {
      const response: ApiResponse = await getFoodItems();
      if (response.success) {
        setFoodItems(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch food items", {
        description: error.message,
      });
    }
  }

  const handleRangWaiter = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/table/rang`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Waiter notified", {
          description: `Waiter is coming to table ${tableId}`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error("Failed to notify waiter", {
        description: error.message,
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Menu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <FoodItemCard key={item.foodName} item={item} />
          ))}
        </div>

        {/* Floating Rang Waiter Button */}
        <Button
          onClick={handleRangWaiter}
          className={cn(
            "fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg z-50"
          )}
        >
          🔔 Rang Waiter
        </Button>
      </div>
    </SidebarProvider>
  );
}
