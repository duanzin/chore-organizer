import { useState, useCallback, useEffect } from "react";
import {
  fetchTasks,
  createTaskApi,
  deleteTaskApi,
  addStepApi,
  updateStepApi,
  deleteStepApi,
} from "@/lib/api";
import { generateId } from "@/lib/utils";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchTasks();
        if (!cancelled) {
          setIsOnline(true);
          setTasks(data);
        }
      } catch {
        setIsOnline(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyTaskUpdate = useCallback((taskId, updater) => {
    let previousTasks;
    setTasks((prevTasks) => {
      previousTasks = prevTasks;
      return prevTasks.map((task) =>
        task.id === taskId ? updater(task) : task
      );
    });
    return () => {
      if (previousTasks) setTasks(previousTasks);
    };
  }, []);

  const applyTasksUpdate = useCallback((updater) => {
    let previousTasks;
    setTasks((prevTasks) => {
      previousTasks = prevTasks;
      return updater(prevTasks);
    });
    return () => {
      if (previousTasks) setTasks(previousTasks);
    };
  }, []);

  const toggleStep = useCallback(
    (taskId, stepId) => {
      const wasOnline = isOnline;
      const rollback = applyTaskUpdate(taskId, (task) => {
        const newSteps = task.steps.map((step) =>
          step.id === stepId ? { ...step, done: !step.done } : step
        );
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        const targetStep = newSteps.find((s) => s.id === stepId);
        if (targetStep) {
          updateStepApi(taskId, stepId, { done: targetStep.done }).catch(() => {
            if (wasOnline) {
              setIsOnline(false);
              rollback();
            }
          });
        }

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [applyTaskUpdate, isOnline]
  );

  const addStep = useCallback(
    (taskId, text) => {
      if (!text || !text.trim()) return;

      const wasOnline = isOnline;
      const localId = generateId();
      const rollback = applyTaskUpdate(taskId, (task) => {
        const newSteps = [
          ...task.steps,
          { id: localId, text: text.trim(), done: false },
        ];
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        addStepApi(taskId, { id: localId, text: text.trim() })
          .then((saved) => {
            setIsOnline(true);
            applyTaskUpdate(taskId, (t) => ({
              ...t,
              steps: t.steps.map((s) => (s.id === localId ? saved : s)),
            }));
          })
          .catch(() => {
            if (wasOnline) {
              setIsOnline(false);
              rollback();
            }
          });

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [applyTaskUpdate, isOnline]
  );

  const removeStep = useCallback(
    (taskId, stepId) => {
      const wasOnline = isOnline;
      const rollback = applyTaskUpdate(taskId, (task) => {
        const newSteps = task.steps.filter((s) => s.id !== stepId);
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        deleteStepApi(taskId, stepId).catch(() => {
          if (wasOnline) {
            setIsOnline(false);
            rollback();
          }
        });

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [applyTaskUpdate, isOnline]
  );

  const updateStep = useCallback(
    (taskId, stepId, newText) => {
      const wasOnline = isOnline;
      const rollback = applyTaskUpdate(taskId, (task) => {
        const newSteps = task.steps.map((s) =>
          s.id === stepId ? { ...s, text: (newText || "").trim() } : s
        );
        const allDone = newSteps.length > 0 && newSteps.every((s) => s.done);

        updateStepApi(taskId, stepId, { text: (newText || "").trim() }).catch(
          () => {
            if (wasOnline) {
              setIsOnline(false);
              rollback();
            }
          }
        );

        return {
          ...task,
          steps: newSteps,
          status: allDone ? "DONE" : "TODO",
        };
      });
    },
    [applyTaskUpdate, isOnline]
  );

  const createTask = useCallback((newTask) => {
    const localId = newTask.id || generateId();
    const payload = { ...newTask, id: localId };
    setTasks((prevTasks) => [...prevTasks, payload]);

    createTaskApi({
      title: payload.title,
      description: payload.description,
      typeId: payload.typeId,
      steps: payload.steps?.map((s) => s.text) || [],
    })
      .then((saved) => {
        setIsOnline(true);
        setTasks((prev) => prev.map((t) => (t.id === localId ? saved : t)));
      })
      .catch(() => {
        setIsOnline(false);
      });
  }, []);

  const deleteTask = useCallback(
    (taskId) => {
      const wasOnline = isOnline;
      const rollback = applyTasksUpdate((prevTasks) =>
        prevTasks.filter((t) => t.id !== taskId)
      );
      deleteTaskApi(taskId).catch(() => {
        if (wasOnline) {
          setIsOnline(false);
          rollback();
        }
      });
    },
    [applyTasksUpdate, isOnline]
  );

  return {
    tasks,
    createTask,
    deleteTask,
    toggleStep,
    addStep,
    removeStep,
    updateStep,
    isOnline,
  };
}
