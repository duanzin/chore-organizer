import { useState, useCallback } from "react";

/**
 * Hook customizado para gerenciar categorias
 */
export function useCategories() {
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

  const [selectedCategories, setSelectedCategories] = useState(
    categories.map((c) => c.id)
  );

  /**
   * Cria uma nova categoria
   */
  const createCategory = useCallback((newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setSelectedCategories((prev) => [...prev, newCategory.id]);
  }, []);

  return {
    categories,
    selectedCategories,
    setSelectedCategories,
    createCategory,
  };
}
