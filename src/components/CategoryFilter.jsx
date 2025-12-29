import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function CategoryFilter({
  categories,
  selectedCategories,
  onSelectedCategoriesChange,
}) {
  if (categories.length === 0) return null;

  return (
    <Card className="p-4 mb-8 bg-white">
      <p className="text-sm font-medium text-slate-700 mb-3">
        Filtrar por Categoria:
      </p>
      <ToggleGroup
        type="multiple"
        value={selectedCategories}
        onValueChange={onSelectedCategoriesChange}
        className="justify-start"
      >
        {categories.map((category) => (
          <ToggleGroupItem
            key={category.id}
            value={category.id}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Card>
  );
}
