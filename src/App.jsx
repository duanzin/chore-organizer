import { useState } from "react";
import { CreateCategoryDialog } from "@/components/CreateCategoryDialog";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { TaskCard } from "@/components/TaskCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";

function App() {
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Doméstica",
      color: "#ef4444",
    },
    {
      id: "2",
      name: "Limpeza",
      color: "#f97316",
    },
  ]);

  const [tasks, setTasks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    categories.map((c) => c.id)
  );

  const handleCreateCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setSelectedCategories([...selectedCategories, newCategory.id]);
  };

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleStepToggle = (taskId, stepId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            steps: task.steps.map((step) => {
              if (step.id === stepId) {
                return { ...step, done: !step.done };
              }
              return step;
            }),
            status:
              task.steps.every((s) => (s.id === stepId ? !s.done : s.done)) &&
              task.steps.length > 0
                ? "DONE"
                : "TODO",
          };
        }
        return task;
      })
    );
  };

  const categoryMap = Object.fromEntries(
    categories.map((cat) => [cat.id, cat])
  );

  const filteredTasks = tasks.filter((task) =>
    selectedCategories.includes(task.typeId)
  );

  const tasksByCategory = selectedCategories.map((catId) => ({
    category: categoryMap[catId],
    tasks: filteredTasks.filter((task) => task.typeId === catId),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Organizador de Tarefas
          </h1>
          <p className="text-slate-600">
            Organize suas tarefas por categorias e acompanhe o progresso dos
            passos.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-3 mb-8">
          <CreateCategoryDialog onCreateCategory={handleCreateCategory} />
          <CreateTaskDialog
            categories={categories}
            onCreateTask={handleCreateTask}
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Card className="p-4 mb-8 bg-white">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Filtrar por Categoria:
            </p>
            <ToggleGroup
              type="multiple"
              value={selectedCategories}
              onValueChange={setSelectedCategories}
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
        )}

        {/* Tasks Grid */}
        <div className="space-y-8">
          {tasksByCategory.map(({ category, tasks: categoryTasks }) => (
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
                <Card className="p-8 text-center bg-slate-50 border-dashed">
                  <p className="text-muted-foreground">
                    Nenhuma tarefa nesta categoria. Crie uma para começar!
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category={category}
                      onStepToggle={handleStepToggle}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <Card className="p-12 text-center bg-slate-50 border-dashed">
              <p className="text-lg text-muted-foreground mb-2">
                Nenhuma tarefa criada ainda.
              </p>
              <p className="text-sm text-muted-foreground">
                Clique em "+ Criar Tarefa" para começar a organizar suas
                atividades!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
