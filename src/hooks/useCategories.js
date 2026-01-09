import { useState, useCallback, useEffect, useRef } from "react";
import { fetchCategories, createCategoryApi } from "@/lib/api";
import { generateId } from "@/lib/utils";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const userSelectedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCategories();
        if (cancelled) return;
        setIsOnline(true);
        setCategories(data);
        setSelectedCategories((prev) => {
          if (!userSelectedRef.current) return data.map((c) => c.id);

          const availableIds = new Set(data.map((c) => c.id));
          const filtered = prev.filter((id) => availableIds.has(id));
          return filtered.length > 0 ? filtered : data.map((c) => c.id);
        });
      } catch {
        if (cancelled) return;
        setIsOnline(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const createCategory = useCallback((newCategory) => {
    const localId = newCategory.id || generateId();
    const optimistic = { ...newCategory, id: localId };

    setCategories((prev) => [...prev, optimistic]);
    setSelectedCategories((prev) => [...prev, optimistic.id]);

    createCategoryApi({ name: optimistic.name, color: optimistic.color })
      .then((saved) => {
        setIsOnline(true);
        setCategories((prev) =>
          prev.map((c) => (c.id === optimistic.id ? saved : c))
        );
        setSelectedCategories((prev) =>
          prev.map((id) => (id === optimistic.id ? saved.id : id))
        );
      })
      .catch(() => {
        setIsOnline(false);
      });
  }, []);

  const selectCategories = useCallback((ids) => {
    userSelectedRef.current = true;
    setSelectedCategories(ids);
  }, []);

  return {
    categories,
    selectedCategories,
    setSelectedCategories: selectCategories,
    createCategory,
    isOnline,
  };
}
