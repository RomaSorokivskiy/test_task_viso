import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Meal } from '../types/Meal';

const SELECTED_MEALS_KEY = 'selectedMeals';

export const useSelectedMeals = () => {
    const queryClient = useQueryClient();


    const [selectedMeals, setSelectedMeals] = useState<Meal[]>(() => {
        return queryClient.getQueryData<Meal[]>([SELECTED_MEALS_KEY]) || [];
    });


    const addMeal = (meal: Meal) => {
        const updatedMeals = [...selectedMeals, meal];
        setSelectedMeals(updatedMeals);
        queryClient.setQueryData([SELECTED_MEALS_KEY], updatedMeals);
    };

    const removeMeal = (idMeal: string) => {
        const updatedMeals = selectedMeals.filter((meal) => meal.idMeal !== idMeal);
        setSelectedMeals(updatedMeals);
        queryClient.setQueryData([SELECTED_MEALS_KEY], updatedMeals);
    };

    return {
        selectedMeals,
        addMeal,
        removeMeal,
    };
};
