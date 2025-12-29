import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";

export function CategorySection({
  category,
  tasks: categoryTasks,
  onStepToggle,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
  onDeleteTask,
}) {
  return (
    <div key={category.id}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <h2 className="text-2xl font-semibold text-slate-800">
          {category.name}
        </h2>
        <span className="text-sm text-muted-foreground">
          ({categoryTasks.length})
        </span>
      </div>

      {categoryTasks.length === 0 ? (
        <EmptyState
          title="Nenhuma tarefa nesta categoria."
          description="Crie uma para começar!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              category={category}
              onStepToggle={onStepToggle}
              onAddStep={onAddStep}
              onRemoveStep={onRemoveStep}
              onUpdateStep={onUpdateStep}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
