import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Meal } from '../types/Meal';

const SELECTED_MEALS_KEY = ['selectedMeals'];

// Хук для роботи з обраними рецептами
export const useSelectedMeals = () => {
    const queryClient = useQueryClient();

    // Отримання обраних рецептів
    const { data: selectedMeals = [] } = useQuery<Meal[]>({
        queryKey: SELECTED_MEALS_KEY,
        queryFn: () => {
            // Повертаємо збережені обрані рецепти або пустий масив
            return queryClient.getQueryData(SELECTED_MEALS_KEY) || [];
        },
        initialData: [], // Початковий стан
    });

    // Додавання рецепту
    const addMealMutation = useMutation<Meal[], unknown, Meal>({
        mutationFn: async (meal: Meal) => {
            const updatedMeals = [...selectedMeals, meal];
            queryClient.setQueryData(SELECTED_MEALS_KEY, updatedMeals);
            return updatedMeals;
        },
    });

    // Видалення рецепту
    const removeMealMutation = useMutation<Meal[], unknown, string>({
        mutationFn: async (idMeal: string) => {
            const updatedMeals = selectedMeals.filter((meal) => meal.idMeal !== idMeal);
            queryClient.setQueryData(SELECTED_MEALS_KEY, updatedMeals);
            return updatedMeals;
        },
    });

    return {
        selectedMeals,
        addMeal: addMealMutation.mutate,
        removeMeal: removeMealMutation.mutate,
    };
};
