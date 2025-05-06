import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Table } from "@/interfaces/TableInterfaces";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { addTable, getTables } from "@/services/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Coffee, 
  Users, 
  MapPin, 
  Clock, 
  X, 
  Check, 
  Edit, 
  Trash2 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/interfaces/User";

export default function RestaurantTable() {
  const [tables, setTables] = useState<any[]>([]); // Store registered tables
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [editingTable, setEditingTable] = useState<number | null>(null);
        // Get user from localStorage
        const userString = localStorage.getItem("user");
        if (!userString) {
          toast.error("User not found. Please login again.");
          return;
        }
  const user: User = JSON.parse(userString);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<Table>({
    defaultValues: {
      id: null,
      tableName: "",
      seatingCapacity: 0,
      available: true,
      userId:  user.userId
    },
  });

  async function fetchTables() {
    // This is a placeholder - real implementation would fetch from API
    try {
      
      // Uncomment when API is ready

      const response = await getTables();
      if (response.success) {
        setTables(response.data);
      } else {
        toast.error("Failed to fetch tables");
      }

    } catch (error) {
      toast.error("Error fetching tables");
    }
  }

  const onSubmit = async (data: Table) => {
    setLoading(true);
    try {
      
      // Uncomment when API is ready
      const response = await addTable(data);
      if (response.success) {
        toast.success("Table added successfully!");
        fetchTables();
      } else {
        setSubmitError("Failed to add table.");
      }

      
      reset();
    } catch (error: any) {
      toast.error("Error adding table: " + error.message);
      setSubmitError("Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (table: any) => {
    setValue("tableName", table.tableName);
    setValue("seatingCapacity", table.seatingCapacity);
    setValue("available", table.available);
    setEditingTable(table.id);
  };

  const handleDelete = (id: number) => {
    setTables(tables.filter(table => table.id !== id));
    toast.success("Table deleted successfully!");
  };

  const handleCancel = () => {
    reset();
    setEditingTable(null);
    setSubmitError("");
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Table Management" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col lg:flex-row gap-6 py-6 px-6">
              {/* Form Card */}
              <Card className="w-full lg:w-1/3">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Coffee size={20} />
                    <CardTitle className="text-lg">
                      {editingTable !== null ? "Edit Table" : "Register a New Table"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {editingTable !== null 
                      ? "Update the details of this table" 
                      : "Add a new table to your restaurant"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit(onSubmit)} id="table-form" className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="tableName" className="text-sm font-medium">
                        Table Name
                      </Label>
                      <Input
                        id="tableName"
                        {...register("tableName", { required: "Table name is required" })}
                        placeholder="e.g. Table 1"
                        className="transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                      {errors.tableName && <p className="text-sm text-red-500 mt-1">{errors.tableName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seatingCapacity" className="text-sm font-medium">
                        Seating Capacity
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="seatingCapacity"
                          type="number"
                          {...register("seatingCapacity", { 
                            required: "Seating capacity is required",
                            min: { value: 1, message: "Capacity must be at least 1" }
                          })}
                          placeholder="e.g. 4"
                          className="transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users size={18} />
                        </div>
                      </div>
                      {errors.seatingCapacity && (
                        <p className="text-sm text-red-500 mt-1">{errors.seatingCapacity.message}</p>
                      )}
                    </div>


                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="available"
                        {...register("available")}
                        defaultChecked={true}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <Label htmlFor="available" className="text-sm font-medium">
                        Available for seating
                      </Label>
                    </div>

                    {submitError && (
                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-900">
                        <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 bg-gray-50 dark:bg-gray-900">
                  <Button 
                    type="submit"
                    form="table-form"
                    disabled={loading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{editingTable !== null ? "Updating..." : "Registering..."}</span>
                      </div>
                    ) : (
                      <span>{editingTable !== null ? "Update Table" : "Register Table"}</span>
                    )}
                  </Button>
                  
                  {editingTable !== null && (
                    <Button 
                      type="button"
                      onClick={handleCancel}
                      className="w-full sm:w-auto bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Tables List */}
              <Card className="w-full lg:w-2/3 flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Clock size={20} />
                      <CardTitle className="text-lg">Registered Tables</CardTitle>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {tables.length} {tables.length === 1 ? 'Table' : 'Tables'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Manage your restaurant's tables and their availability
                  </CardDescription>
                </CardHeader>
                
                <ScrollArea className="flex-1">
                  {tables.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">No tables registered yet.</p>
                    </div>
                  ) : (
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Table Name</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tables.map((table) => (
                          <TableRow key={table.id}>
                            <TableCell className="font-medium">{table.tableName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users size={14} className="text-gray-500" />
                                <span>{table.seatingCapacity}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {table.available ? (
                                <div className="flex items-center">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    <Check size={12} className="mr-1" /> Available
                                  </Badge>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                    <X size={12} className="mr-1" /> Occupied
                                  </Badge>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEdit(table)}
                                  className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDelete(table.id)}
                                  className="h-8 w-8 p-0 text-red-600 dark:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
                  )}
                </ScrollArea>
                
                <CardFooter className="bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {tables.filter(t => t.available).length} of {tables.length} tables available
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={fetchTables}
                    className="hidden sm:flex"
                  >
                    Refresh List
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}