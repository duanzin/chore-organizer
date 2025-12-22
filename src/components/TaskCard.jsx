import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TaskCard({ task, category, onStepToggle, onDeleteTask }) {
  const allStepsDone = task.steps.length > 0 && task.steps.every((s) => s.done);
  const completedSteps = task.steps.filter((s) => s.done).length;

  return (
    <Card className="p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3
            className={`font-semibold text-base ${
              allStepsDone ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: category?.color || "#ccc" }}
          />
          {onDeleteTask && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Tem certeza que deseja
                    excluir "{task.title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteTask(task.id)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {task.steps.length > 0 && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {completedSteps}/{task.steps.length} passos concluídos
          </p>
          {task.steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <Checkbox
                id={`step-${step.id}`}
                checked={step.done}
                onCheckedChange={() => onStepToggle(task.id, step.id)}
              />
              <Label
                htmlFor={`step-${step.id}`}
                className={`text-sm cursor-pointer ${
                  step.done
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {step.text}
              </Label>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t">
        <p className="text-xs font-medium">
          Status:{" "}
          <span
            className={`${
              allStepsDone && task.steps.length > 0
                ? "text-green-600 font-semibold"
                : "text-amber-600"
            }`}
          >
            {allStepsDone && task.steps.length > 0 ? "✓ Pronto" : "A Fazer"}
          </span>
        </p>
      </div>
    </Card>
  );
}
