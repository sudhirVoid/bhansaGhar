import { useState } from "react"
import { useForm } from "react-hook-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  id: string
  label: string
}

interface FormValues {
  title: string
  category: string
  info: string
  price: number
  spicy: boolean
  popular: boolean
  newCategory: string
}

// Mock initial categories
const initialCategories: Category[] = [
  { id: "all", label: "All Items" },
  { id: "mexican", label: "Mexican" },
  { id: "indian", label: "Indian" },
  { id: "italian", label: "Italian" },
  { id: "chinese", label: "Chinese" },
]

// Mock API call
const mockAddCategoryAPI = (name: string): Promise<Category> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: name.toLowerCase().replace(/\s+/g, "-"), label: name.trim() })
    }, 1000)
  })
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState<string>("")

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
  })

  const watchNewCategory = watch("newCategory")

  const onSubmit = (data: FormValues) => {
    console.log("Item Submitted:", data)
    reset()
  }

  const handleAddCategory = async () => {
    const trimmedName = watchNewCategory.trim()
    setCategoryError("") // clear previous error

    if (!trimmedName) return

    const exists = categories.some(
      (cat) => cat.label.toLowerCase() === trimmedName.toLowerCase()
    )

    if (exists) {
      setCategoryError("Category already exists!")
      return
    }

    try {
      setLoadingCategory(true)
      const newCat = await mockAddCategoryAPI(trimmedName)
      setCategories((prev) => [...prev, newCat])
      setValue("newCategory", "") // Clear input
    } catch (error) {
      console.error("Failed to add category", error)
      setCategoryError("Failed to add category. Please try again.")
    } finally {
      setLoadingCategory(false)
    }
  }

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
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-background"
                      >
                        {category.label}
                      </TabsTrigger>
                    ))}
                    <TabsTrigger value="add-new" className="data-[state=active]:bg-background">
                      Add New Item
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <SectionCards />
                  </TabsContent>

                  {categories.map((cat) => (
                    <TabsContent key={cat.id} value={cat.id}>
                      <SectionCards />
                    </TabsContent>
                  ))}

                  {/* Add New Item Form */}
                  <TabsContent value="add-new" className="px-2 md:px-6 pt-6 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          {...register("title", { required: true })}
                          placeholder="e.g. Chicken Tikka Masala"
                        />
                        {errors.title && <p className="text-red-500 text-xs">Title is required</p>}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-2/3">
                          <Label htmlFor="category">Category</Label>
                          <Select onValueChange={(value) => setValue("category", value)}>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.label}
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
                            disabled={!watchNewCategory.trim() || loadingCategory}
                          >
                            {loadingCategory ? "Adding..." : "Add Category"}
                          </Button>
                          {categoryError && (
                            <p className="text-red-500 text-xs">{categoryError}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="info">Additional Info</Label>
                        <Input
                          id="info"
                          {...register("info")}
                          placeholder="e.g. Served with garlic naan"
                        />
                      </div>

                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          {...register("price", { required: true, valueAsNumber: true })}
                          placeholder="e.g. 12.99"
                        />
                        {errors.price && (
                          <p className="text-red-500 text-xs">Price is required</p>
                        )}
                      </div>

                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="spicy"
                            checked={watch("spicy")}
                            onCheckedChange={(checked) => setValue("spicy", !!checked)}
                          />
                          <Label htmlFor="spicy">Spicy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="popular"
                            checked={watch("popular")}
                            onCheckedChange={(checked) => setValue("popular", !!checked)}
                          />
                          <Label htmlFor="popular">Popular</Label>
                        </div>
                      </div>

                      <Button type="submit">Add Item</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
