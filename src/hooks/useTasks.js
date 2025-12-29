import { useState, useCallback } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState([]);

  const updateTask = useCallback((taskId, updater) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updater(task) : task))
    );
  }, []);

  const toggleStep = useCallback(
    (taskId, stepId) => {
      updateTask(taskId, (task) => {
        const newSteps = task.steps.map((step) =>
          step.id === stepId ? { ...step, done: !step.done } : step
        );
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [updateTask]
  );

  const addStep = useCallback(
    (taskId, text) => {
      if (!text || !text.trim()) return;

      updateTask(taskId, (task) => {
        const newSteps = [
          ...task.steps,
          { id: Date.now().toString(), text: text.trim(), done: false },
        ];
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [updateTask]
  );

  const removeStep = useCallback(
    (taskId, stepId) => {
      updateTask(taskId, (task) => {
        const newSteps = task.steps.filter((s) => s.id !== stepId);
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [updateTask]
  );

  const updateStep = useCallback(
    (taskId, stepId, newText) => {
      updateTask(taskId, (task) => {
        const newSteps = task.steps.map((s) =>
          s.id === stepId ? { ...s, text: (newText || "").trim() } : s
        );
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [updateTask]
  );

  const createTask = useCallback((newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
  }, []);

  return {
    tasks,
    createTask,
    deleteTask,
    toggleStep,
    addStep,
    removeStep,
    updateStep,
  };
}
