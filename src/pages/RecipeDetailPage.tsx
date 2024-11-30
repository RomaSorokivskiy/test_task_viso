import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMealById } from '../api/mealApi';
import { Box, Typography, List, ListItem, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useSelectedMeals } from '../hooks/useSelectedMeals';

const RecipeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addMeal, removeMeal, selectedMeals } = useSelectedMeals();

    const { data, isLoading, error } = useQuery({
        queryKey: ['meal', id],
        queryFn: async () => {
            if (!id) throw new Error('Invalid ID');
            return fetchMealById(id);
        },
        enabled: !!id,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;
    if (!data) return <div>No data available</div>;

    const isSelected = selectedMeals.some((meal) => meal.idMeal === data.idMeal);

    const toggleMealSelection = () => {
        if (isSelected) {
            removeMeal(data.idMeal);
        } else {
            addMeal(data);
        }
    };

    return (
        <Box>

            <Card sx={{ maxWidth: 600, marginBottom: 2 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={data.strMealThumb}
                    alt={data.strMeal}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {data.strMeal}
                    </Typography>
                    <Typography variant="h6">{data.strCategory} - {data.strArea}</Typography>
                </CardContent>
            </Card>

            <Typography variant="h6" mt={3}>Ingredients:</Typography>
            <List>
                {data.strIngredients.map((ingredient, index) => (
                    <ListItem key={ingredient}>
                        {ingredient}: {data.strMeasures[index]}
                    </ListItem>
                ))}
            </List>


            <Typography variant="body1" mt={3}>
                {data.strInstructions}
            </Typography>

            <Box display="flex" justifyContent="space-between" mt={3}>

                <Button
                    variant="contained"
                    color={isSelected ? "secondary" : "primary"}
                    onClick={toggleMealSelection}
                >
                    {isSelected ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/favorites')}
                >
                    Go to Favorites
                </Button>
            </Box>
        </Box>
    );
};

export default RecipeDetailPage;
