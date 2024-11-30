import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMeals } from '../api/mealApi';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const RecipesPage = () => {
    const { data, isLoading, error } = useQuery(['meals'], fetchMeals);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <Grid container spacing={2}>
            {data.map((meal: any) => (
                <Grid item xs={12} sm={6} md={4} key={meal.idMeal}>
                    <Card>
                        <CardMedia component="img" image={meal.strMealThumb} alt={meal.strMeal} />
                        <CardContent>
                            <Typography variant="h6">{meal.strMeal}</Typography>
                            <Typography variant="body2">Category: {meal.strCategory}</Typography>
                            <Typography variant="body2">Area: {meal.strArea}</Typography>
                            <Link to={`/recipe/${meal.idMeal}`}>View Recipe</Link>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default RecipesPage;
