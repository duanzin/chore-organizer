import { useMemo } from "react";
import { CreateCategoryDialog } from "@/components/CreateCategoryDialog";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CategorySection } from "@/components/CategorySection";
import { EmptyState } from "@/components/EmptyState";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";

function App() {
  const {
    tasks,
    createTask,
    deleteTask,
    toggleStep,
    addStep,
    removeStep,
    updateStep,
  } = useTasks();

  const {
    categories,
    selectedCategories,
    setSelectedCategories,
    createCategory,
  } = useCategories();

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((cat) => [cat.id, cat])),
    [categories]
  );

  const filteredTasks = useMemo(
    () => tasks.filter((task) => selectedCategories.includes(task.typeId)),
    [tasks, selectedCategories]
  );

  const tasksByCategory = useMemo(
    () =>
      selectedCategories.map((catId) => ({
        category: categoryMap[catId],
        tasks: filteredTasks.filter((task) => task.typeId === catId),
      })),
    [selectedCategories, filteredTasks, categoryMap]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Organizador de Tarefas
          </h1>
          <p className="text-slate-600">
            Organize suas tarefas por categorias e acompanhe o progresso dos
            passos.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <CreateCategoryDialog onCreateCategory={createCategory} />
          <CreateTaskDialog categories={categories} onCreateTask={createTask} />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectedCategoriesChange={setSelectedCategories}
        />

        <div className="space-y-8">
          {tasksByCategory.length === 0 || filteredTasks.length === 0 ? (
            <EmptyState
              title="Nenhuma tarefa criada ainda."
              description='Clique em "+ Criar Tarefa" para começar a organizar suas atividades!'
            />
          ) : (
            tasksByCategory.map(({ category, tasks: categoryTasks }) => (
              <CategorySection
                key={category.id}
                category={category}
                tasks={categoryTasks}
                onStepToggle={toggleStep}
                onAddStep={addStep}
                onRemoveStep={removeStep}
                onUpdateStep={updateStep}
                onDeleteTask={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
