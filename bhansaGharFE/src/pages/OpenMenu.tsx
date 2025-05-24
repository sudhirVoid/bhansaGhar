import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FoodItemCard } from "@/components/section-cards";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FoodCategory, FoodItem } from "@/interfaces/MenuInterfaces";
import { ApiResponse } from "@/interfaces/ApiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getOpenCategories, getOpenFoodItems } from "@/services/openMenu";
import { Bell, Filter, Grid3X3, ChevronLeft, X } from "lucide-react";

export default function OpenMenu() {
  const { tableId } = useParams<{ tableId: string }>();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCategories(), fetchFoodItems()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  async function fetchCategories() {
    try {
      const response: ApiResponse = await getOpenCategories();
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
      const response: ApiResponse = await getOpenFoodItems();
      if (response.success) {
        setFoodItems(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch food items", {
        description: error.message,
      });
    }
  }

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSelectedCategories(["all"]);
    } else {
      let updated = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories.filter((c) => c !== "all"), category];
      if (updated.length === 0) updated = ["all"];
      setSelectedCategories(updated);
    }
  };

  const filteredFoodItems =
    selectedCategories.includes("all")
      ? foodItems
      : foodItems.filter((item) =>
          selectedCategories.includes(item.category.categoryName)
        );

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

  const getItemCountForCategory = (categoryName: string) => {
    if (categoryName === "all") return foodItems.length;
    return foodItems.filter(item => item.category.categoryName === categoryName).length;
  };

  const clearAllFilters = () => {
    setSelectedCategories(["all"]);
  };

  const hasActiveFilters = !selectedCategories.includes("all") && selectedCategories.length > 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50/30">
        {/* Apple-inspired Collapsible Filter Sidebar */}
        <div className={cn(
          "relative bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-sm transition-all duration-300 ease-in-out",
          isFilterOpen ? "w-80" : "w-0 overflow-hidden"
        )}>
          <div className="h-full flex flex-col relative">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {/* Quick Actions */}
                  {hasActiveFilters && (
                    <div className="bg-blue-50/80 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                          {selectedCategories.length} filter{selectedCategories.length === 1 ? '' : 's'} active
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="h-6 px-2 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                        >
                          Clear all
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Categories Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Categories</h3>
                    
                    {/* All Categories Option */}
                    <div className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                      "hover:bg-gray-50 border border-transparent",
                      selectedCategories.includes("all") ? "bg-blue-50 border-blue-200" : ""
                    )}>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="category-all"
                          checked={selectedCategories.includes("all")}
                          onCheckedChange={() => handleCategoryChange("all")}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
                        />
                        <label 
                          htmlFor="category-all" 
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          All Categories
                        </label>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs font-medium transition-colors",
                          selectedCategories.includes("all") 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {getItemCountForCategory("all")}
                      </Badge>
                    </div>

                    <div className="w-full h-px bg-gray-200"></div>

                    {/* Individual Categories */}
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div 
                          key={cat.categoryName} 
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                            "hover:bg-gray-50 border border-transparent",
                            selectedCategories.includes(cat.categoryName) ? "bg-blue-50 border-blue-200" : ""
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`category-${cat.categoryName}`}
                              checked={selectedCategories.includes(cat.categoryName)}
                              onCheckedChange={() => handleCategoryChange(cat.categoryName)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-gray-300"
                            />
                            <label 
                              htmlFor={`category-${cat.categoryName}`} 
                              className="text-sm font-medium text-gray-700 cursor-pointer capitalize"
                            >
                              {cat.categoryName}
                            </label>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs font-medium transition-colors",
                              selectedCategories.includes(cat.categoryName) 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-gray-50 text-gray-600 border-gray-200"
                            )}
                          >
                            {getItemCountForCategory(cat.categoryName)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Toggle Filter Button (when closed) */}
        {!isFilterOpen && (
          <Button
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              "fixed top-4 left-4 z-40 w-12 h-12 rounded-full bg-white/95 backdrop-blur-xl border border-gray-200/50",
              "shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white",
              "flex items-center justify-center text-gray-700 hover:text-gray-900",
              hasActiveFilters && "ring-2 ring-blue-500 ring-offset-2"
            )}
            variant="ghost"
          >
            <div className="relative">
              <Filter className="h-5 w-5" />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </Button>
        )}

        {/* Enhanced Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div
            className={cn(
              "bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30",
              !isFilterOpen && "pl-20"
            )}
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Title Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Menu</h1>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs text-gray-600 hover:text-gray-900 h-8 whitespace-nowrap"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                    <Badge variant="outline" className="px-2 py-1 bg-gray-50 text-xs flex-shrink-0 whitespace-nowrap">
                      Table {tableId}
                    </Badge>
                  </div>
                </div>
                
                {/* Info Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <p className="text-gray-600 text-sm">
                    {filteredFoodItems.length} items available
                  </p>
                  {hasActiveFilters && (
                    <span className="text-xs text-blue-600 font-medium">
                      • Filtered by {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className={cn("flex-1 p-6", !isFilterOpen && "pl-20")}> 
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading menu items...</p>
                </div>
              </div>
            ) : filteredFoodItems.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 bg-white/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Grid3X3 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-500 text-center max-w-sm mb-4">
                    No menu items match your current filter selection.
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFoodItems.map((item) => (
                  <FoodItemCard key={item.foodName} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Floating Call Waiter Button */}
        <Button
          onClick={handleRangWaiter}
          size="lg"
          className={cn(
            "fixed bottom-6 right-6 h-14 px-6 bg-red-500 hover:bg-red-600 text-white",
            "rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
            "z-50 flex items-center gap-2 font-medium backdrop-blur-xl"
          )}
        >
          <Bell className="h-5 w-5" />
          Ring Waiter
        </Button>
      </div>
    </SidebarProvider>
  );
}