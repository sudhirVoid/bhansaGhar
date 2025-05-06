import { useState } from "react";
import { useForm } from "react-hook-form";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/interfaces/User";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { useEffect } from "react";
import { FoodCategory, FoodItem } from "@/interfaces/MenuInterfaces";
import { addCategory, addFoodItem, getCategories, getFoodItems } from "@/services/menu";
import { toast } from "sonner";

interface FormValues {
  title: string;
  category: string;
  info: string;
  price: number;
  spicy: boolean;
  popular: boolean;
  newCategory: string;
}

// Mock initial categories
const initialCategories: FoodCategory[] = [];

export const API_BASE_URL = "http://localhost:3000/api/v1";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] =
    useState<FoodCategory[]>(initialCategories);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string>("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "",
      info: "",
      price: 0,
      spicy: false,
      popular: false,
      newCategory: "",
    },
  });

  async function fetchCategories() {
    try {
      const response: ApiResponse = await getCategories();
      console.log("Fetched Categories:", response);
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      setCategoryError(error.message);
    }
  }

  async function fetchFoodItems() {
    try {
      const response: ApiResponse = await getFoodItems();
      console.log(response.data);
      if(response.success) {
        setFoodItems(response.data);
        console.log("Fetched Food Items:", foodItems);
      }

    }
    catch (error: any) {
      console.error("Failed to fetch food items:", error);
      toast.error("Failed to fetch food items");
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchFoodItems();
  }, []);

  const watchNewCategory = watch("newCategory");

  // Add state for loading and error
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      setSubmitError("");

      // Get user from localStorage
      const userString = localStorage.getItem("user");
      if (!userString) {
        toast.error("User not found. Please login again.");
        return;
      }

      const user: User = JSON.parse(userString);

      // Prepare tags array
      const tags: string[] = [];
      if (data.spicy) tags.push("spicy");
      if (data.popular) tags.push("popular");

      // Prepare the payload
      const selectedCategory = categories.find(cat => cat.categoryId === data.category);
      if (!selectedCategory) {
        toast.error("Selected category not found");
        return;
      }

      const payload: FoodItem = {
        foodName: data.title,
        price: data.price,
        category: { 
          categoryId: data.category,
          categoryName: selectedCategory.categoryName 
        },
        userId: user.userId,
        description: data.info || "",
        tags,
        variants: [{ name: "Regular", additionalPrice: 0 }],
      };

      const response = await addFoodItem(payload);

      if (response.success) {
        toast.success("Food item added successfully", {
          description: `${data.title} has been added to the menu.`,
        });
        reset();
        // Optionally refresh the menu items
      }
    } catch (error: any) {
      console.error("Failed to add food item:", error);
      toast.error("Failed to add food item", {
        description: error.message || "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    const categoryToAdd = watchNewCategory.trim();
    setCategoryError("");

    if (!categoryToAdd) return;

    const exists = categories.some(
      (cat) => cat.categoryName.toLowerCase() === categoryToAdd.toLowerCase()
    );

    if (exists) {
      toast.error('Category already exists');
      return;
    }

    try {
      setLoadingCategory(true);
      // Get user from localStorage
      const userString = localStorage.getItem("user");
      if (!userString) {
        toast.error('User not found. Please login again.');
        return;
      }

      const user: User = JSON.parse(userString);
      const response: ApiResponse = await addCategory(
        categoryToAdd,
        user.userId
      );

      if (!response.success) {
        switch (response.statusCode) {
          case 409:
            toast.error('Category already exists');
            break;
          default:
            toast.error('Failed to add category');
            break;
        }
      } else {
        toast.success(`${response.data.categoryName} category added successfully`);
        setCategories((prev) => [
          ...prev,
          {
            categoryId: response.data._id,
            categoryName: response.data.categoryName,
          },
        ]);
        
      }

      setValue("newCategory", "");
    } catch (error: any) {
      console.error("Failed to add category", error);
      setCategoryError(
        error.message || "Failed to add category. Please try again."
      );
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Menu" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-6">
                <Tabs
                  defaultValue="all"
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                  className="w-full"
                >
                  <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-1">
                  <TabsTrigger
                      value="all-items"
                      className="data-[state=active]:bg-background"
                    >
                      All Items
                    </TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.categoryId}
                        value={category.categoryId}
                        className="data-[state=active]:bg-background"
                      >
                        {category.categoryName}
                      </TabsTrigger>
                    ))}
                    <TabsTrigger
                      value="add-new"
                      className="data-[state=active]:bg-background"
                    >
                      Add New Item
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <SectionCards />
                  </TabsContent>

                  {categories.map((cat) => (
                    <TabsContent key={cat.categoryId} value={cat.categoryName}>
                      <SectionCards />
                    </TabsContent>
                  ))}

                  {/* Add New Item Form */}
                  <TabsContent
                    value="add-new"
                    className="px-2 md:px-6 pt-6 space-y-6"
                  >
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="title" className="py-2">
                          Title
                        </Label>
                        <Input
                          id="title"
                          {...register("title", { required: true })}
                          placeholder="e.g. Chicken Tikka Masala"
                        />
                        {errors.title && (
                          <p className="text-red-500 text-xs">
                            Title is required
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2/3">
                          <Label htmlFor="category" className="py-2">
                            Category
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              setValue("category", value)
                            }
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat.categoryId}
                                  value={cat.categoryId}
                                >
                                  {cat.categoryName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="w-1/3 flex flex-col space-y-2">
                          <Input
                            id="new-category"
                            placeholder="Add new category"
                            {...register("newCategory")}
                          />
                          <Button
                            type="button"
                            onClick={handleAddCategory}
                            disabled={
                              !watchNewCategory.trim() || loadingCategory
                            }
                          >
                            {loadingCategory ? (
                              <>
                                <span className="animate-spin mr-2">⌛</span>
                                Adding...
                              </>
                            ) : (
                              "Add Category"
                            )}
                          </Button>
                          {categoryError && (
                            <p className="text-red-500 text-xs">
                              {categoryError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="info" className="py-2">
                          Additional Info
                        </Label>
                        <Input
                          id="info"
                          {...register("info")}
                          placeholder="e.g. Served with garlic naan"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price" className="py-2">
                          Price
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          {...register("price", {
                            required: true,
                            valueAsNumber: true,
                          })}
                          placeholder="e.g. 12.99"
                        />
                        {errors.price && (
                          <p className="text-red-500 text-xs">
                            Price is required
                          </p>
                        )}
                      </div>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="spicy"
                            checked={watch("spicy")}
                            onCheckedChange={(checked) =>
                              setValue("spicy", !!checked)
                            }
                          />
                          <Label htmlFor="spicy">Spicy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="popular"
                            checked={watch("popular")}
                            onCheckedChange={(checked) =>
                              setValue("popular", !!checked)
                            }
                          />
                          <Label htmlFor="popular">Popular</Label>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full"
                      >
                        {submitting ? (
                          <>
                            <span className="animate-spin mr-2">⌛</span>
                            Adding...
                          </>
                        ) : (
                          "Add Item"
                        )}
                      </Button>
                      {submitError && (
                        <p className="text-red-500 text-sm">{submitError}</p>
                      )}
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
