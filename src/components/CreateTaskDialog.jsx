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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateTaskDialog({ categories, onCreateTask }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState("");

  const handleAddStep = () => {
    if (currentStep.trim()) {
      setSteps([...steps, { id: Date.now().toString(), text: currentStep }]);
      setCurrentStep("");
    }
  };

  const handleRemoveStep = (stepId) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const handleCreateTask = () => {
    if (title.trim() && selectedCategory) {
      onCreateTask({
        id: Date.now().toString(),
        title,
        description,
        typeId: selectedCategory,
        steps: steps.map((step) => ({
          id: step.id,
          text: step.text,
          done: false,
        })),
        status: "TODO",
      });
      setTitle("");
      setDescription("");
      setSelectedCategory("");
      setSteps([]);
      setCurrentStep("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Criar Tarefa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Adicione uma tarefa com passos a serem executados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Título da Tarefa *</Label>
            <Input
              id="task-title"
              placeholder="Ex: Lavar roupas..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Descrição (opcional)</Label>
            <Input
              id="task-description"
              placeholder="Detalhes adicionais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-category">Categoria *</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="task-category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-steps">Passos</Label>
            <div className="flex gap-2">
              <Input
                id="task-steps"
                placeholder="Ex: Separar roupas..."
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddStep();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddStep}
                disabled={!currentStep.trim()}
              >
                Adicionar
              </Button>
            </div>

            {steps.length > 0 && (
              <div className="space-y-2 mt-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="text-sm">{step.text}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStep(step.id)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!title.trim() || !selectedCategory}
            >
              Criar Tarefa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
