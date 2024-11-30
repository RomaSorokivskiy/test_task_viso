import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const fetchMeals = async () => {
    const response = await axios.get(`${API_URL}/search.php?s=`);
    return response.data.meals;
};

export const fetchMealById = async (id: string) => {
    const response = await axios.get(`${API_URL}/lookup.php?i=${id}`);
    return response.data.meals[0];
};
