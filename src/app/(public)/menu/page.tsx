import { getMenuCategories } from "@/actions/menu";
import MenuCard from "@/components/public/menu-card";
import { Utensils, Search, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "";
  const searchQuery = resolvedParams.search || "";

  const categories = await getMenuCategories();

  // Filter categories and items according to parameters
  let filteredCategories = categories;

  if (activeCategory) {
    filteredCategories = categories.filter((c: any) => c.slug === activeCategory);
  }

  // Flatten items for filtering if search query exists
  let allItems = categories.flatMap((c: any) => 
    c.items.map((item: any) => ({ ...item, category: { name: c.name } }))
  );

  if (searchQuery) {
    allItems = allItems.filter((item: any) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title & Info */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Utensils className="h-3.5 w-3.5" />
          MENU FOR FOOD
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-primary">
          Our Restaurant Menu
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Taste fresh local delights cooked with premium ingredients. Our speciality includes farm-fresh Rohu fish, local chicken curry, organic salads, and traditional local cuisines.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-md mx-auto">
        <form method="GET" className="relative flex gap-2">
          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={searchQuery}
              placeholder="Search dishes..."
              className="pl-10 pr-4 py-6 border-border/60 focus-visible:ring-primary rounded-xl"
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/95 text-white rounded-xl px-6">
            Search
          </Button>
        </form>
      </div>

      {/* Categories Tabs & Menu Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-heading font-bold text-lg text-foreground px-3 mb-4 flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-primary" />
            Categories
          </h3>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-1.5 scrollbar-none">
            <Link
              href="/menu"
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                !activeCategory
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Items
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ""}`}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="lg:col-span-3">
          {searchQuery ? (
            /* Search results view */
            <div>
              <h3 className="font-bold text-lg text-foreground mb-6">
                Search Results for "{searchQuery}"
              </h3>
              {allItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allItems.map((item: any) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-2xl max-w-md mx-auto space-y-3">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h4 className="font-semibold text-base text-foreground">No dishes found</h4>
                  <p className="text-sm text-muted-foreground">
                    Try searching for another dish or check your spelling.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Standard category view */
            <div className="space-y-12">
              {filteredCategories.map((cat: any) => (
                <div key={cat.id} className="space-y-6">
                  <h3 className="font-heading font-bold text-2xl text-primary border-b pb-2">
                    {cat.name}
                  </h3>
                  {cat.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cat.items.map((item: any) => (
                        <MenuCard
                          key={item.id}
                          item={{ ...item, category: { name: cat.name } }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No items available in this category today.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
