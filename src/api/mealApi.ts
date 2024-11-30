import axios from 'axios';
import { Meal } from "../types/Meal";

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const fetchCategories = async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/categories.php`);
    return response.data.categories.map((cat: any) => cat.strCategory);
};

export const fetchMealsByCategory = async (
    category: string,
    page: number,
    itemsPerPage: number,
    searchQuery: string
): Promise<{ meals: Array<Meal>; total: number }> => {
    let meals = [];

    if (category === 'All' && searchQuery) {
        const response = await axios.get(`${API_URL}/search.php?s=${searchQuery}`);
        meals = response.data.meals ?? [];
    } else if (category === 'All' && !searchQuery) {

        const response = await axios.get(`${API_URL}/search.php?s=`);
        meals = response.data.meals ?? [];
    } else if (category !== 'All' && searchQuery) {

        const responseCat = await axios.get(`${API_URL}/filter.php?c=${category}`);
        const responseSearch = await axios.get(`${API_URL}/search.php?s=${searchQuery}`);

        const categoryMeals = responseCat.data.meals ?? [];
        const searchMeals = responseSearch.data.meals ?? [];

        
        meals = categoryMeals.filter((meal: any) =>
            searchMeals.some((searchMeal: any) => searchMeal.idMeal === meal.idMeal)
        );
    } else if (category !== 'All') {

        const response = await axios.get(`${API_URL}/filter.php?c=${category}`);
        meals = response.data.meals ?? [];
    }

    const updatedMeals = meals.map((meal: any) => {
        const { ingredients, measures } = extractIngredients(meal);
        return {
            ...meal,
            strIngredients: ingredients,
            strMeasures: measures,
        };
    });

    const paginatedMeals = updatedMeals.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return { meals: paginatedMeals, total: meals.length };
};

export const fetchMealById = async (id: string): Promise<Meal> => {
    const response = await axios.get(`${API_URL}/lookup.php?i=${id}`);
    const meal = response.data.meals[0];

    const { ingredients, measures } = extractIngredients(meal);

    return {
        ...meal,
        strIngredients: ingredients,
        strMeasures: measures,
    };
};

const extractIngredients = (meal: any) => {
    const ingredients: string[] = [];
    const measures: string[] = [];

    for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}`;
        const measureKey = `strMeasure${i}`;

        if (meal[ingredientKey] && meal[ingredientKey].trim()) {
            ingredients.push(meal[ingredientKey]);
            measures.push(meal[measureKey]);
        }
    }

    return { ingredients, measures };
};

