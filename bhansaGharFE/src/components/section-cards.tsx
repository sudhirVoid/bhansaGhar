import { FlameIcon, StarIcon } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FoodItem {
  name: string;
  category: string;
  description: string;
  price: number;
  isSpicy?: boolean;
  isPopular?: boolean;
}

export function FoodItemCard({ item }: { item: FoodItem }) {
  return (
    <Card className="max-w-sm shadow-md transition hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {item.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Category: {item.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-2">
          {item.isSpicy && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <FlameIcon className="size-3 text-red-500" />
              Spicy
            </Badge>
          )}
          {item.isPopular && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <StarIcon className="size-3 text-yellow-400" />
              Popular
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
      </CardFooter>
    </Card>
  )
}

export function SectionCards() {
  const menuItems: FoodItem[] = [
    {
      name: "Grilled Chicken Tacos",
      category: "Mexican",
      description: "Soft corn tortillas filled with marinated grilled chicken, topped with spicy salsa and fresh cilantro.",
      price: 10.99,
      isSpicy: true,
      isPopular: true
    },
    // Add more menu items here
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {menuItems.map((item, index) => (
        <FoodItemCard key={index} item={item} />
      ))}
    </div>
  )
}