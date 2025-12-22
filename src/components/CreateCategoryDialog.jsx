import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateCategoryDialog({ onCreateCategory }) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#3b82f6");

  const handleCreateCategory = () => {
    if (categoryName.trim()) {
      onCreateCategory({
        id: Date.now().toString(),
        name: categoryName,
        color: categoryColor,
      });
      setCategoryName("");
      setCategoryColor("#3b82f6");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Criar Categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova categoria para organizar suas tarefas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              placeholder="Ex: Doméstica, Limpeza, Compras..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateCategory();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-color">Cor</Label>
            <div className="flex gap-2">
              <Input
                id="category-color"
                type="color"
                value={categoryColor}
                onChange={(e) => setCategoryColor(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-md border"
                style={{ backgroundColor: categoryColor }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCategory}>Criar Categoria</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
