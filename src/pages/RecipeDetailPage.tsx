import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMealById } from '../api/mealApi';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery(['meal', id], () => fetchMealById(id!));

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div>
            <h1>{data.strMeal}</h1>
        <img src={data.strMealThumb} alt={data.strMeal} />
    <p>{data.strInstructions}</p>
    </div>
);
};

export default RecipeDetailPage;
