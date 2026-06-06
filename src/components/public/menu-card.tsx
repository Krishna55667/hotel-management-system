import { Utensils, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuItemProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
    category: {
      name: string;
    };
  };
}

export default function MenuCard({ item }: MenuItemProps) {
  // Let's check if it's a signature dish (like fish items)
  const isSignature = item.category.name.toLowerCase().includes("fish") || 
                      item.name.toLowerCase().includes("local");

  return (
    <Card className="overflow-hidden border border-border/40 hover:border-primary/25 hover:shadow-md transition-all duration-300 bg-card group relative">
      {isSignature && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary border-none gap-1 py-0.5">
            <Award className="h-3 w-3" />
            Signature
          </Badge>
        </div>
      )}
      <CardContent className="p-5 flex gap-4 items-start">
        {/* Decorative Food Icon Placeholder */}
        <div className="bg-primary/5 text-primary p-3 rounded-xl shrink-0 group-hover:bg-primary/10 transition-colors">
          <Utensils className="h-6 w-6" />
        </div>

        <div className="space-y-1.5 flex-grow">
          <div className="flex justify-between items-baseline gap-2">
            <h4 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </h4>
            <span className="font-bold text-primary shrink-0">
              Rs. {item.price}
            </span>
          </div>
          
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {item.category.name}
            </span>
            {!item.available && (
              <span className="text-[10px] text-destructive font-semibold">
                Unavailable Today
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
