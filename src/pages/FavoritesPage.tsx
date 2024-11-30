import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, List, ListItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelectedMeals } from '../hooks/useSelectedMeals';

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const { selectedMeals, removeMeal } = useSelectedMeals();
    const [searchQuery, setSearchQuery] = useState<string>('');


    const calculateIngredients = () => {
        const ingredientCount: { [key: string]: number } = {};

        selectedMeals.forEach((meal) => {
            if (meal.strIngredients && Array.isArray(meal.strIngredients)) {
                meal.strIngredients.forEach((ingredient, index) => {
                    if (ingredient && ingredient.trim()) {
                        const measure = meal.strMeasures?.[index] || '';
                        const ingredientKey = `${ingredient} ${measure}`;
                        ingredientCount[ingredientKey] = (ingredientCount[ingredientKey] || 0) + 1;
                    }
                });
            }
        });

        return ingredientCount;
    };


    const filteredMeals = selectedMeals.filter((meal) =>
        meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ingredientCount = calculateIngredients();

    const handleBack = () => {
        navigate(-1);
    };

    const handleRemove = (mealId: string) => {
        removeMeal(mealId);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Favorite Recipes
            </Typography>


            <Box display="flex" justifyContent="center" mb={3}>
                <TextField
                    label="Search in Favorites"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            {filteredMeals.length === 0 ? (
                <Typography>No favorite recipes selected yet or match your search query.</Typography>
            ) : (
                <Box>

                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={16}>
                        {filteredMeals.map((meal) => (
                            <Card key={meal.idMeal}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={meal.strMealThumb}
                                    alt={meal.strMeal}
                                />
                                <CardContent>
                                    <Typography variant="h6">{meal.strMeal}</Typography>
                                    <Typography>{meal.strCategory}</Typography>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRemove(meal.idMeal)}
                                        sx={{ mt: 2 }}
                                    >
                                        Remove from Favorites
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>


                    <Typography variant="h6" mt={4}>
                        Ingredients:
                    </Typography>
                    <List>
                        {Object.entries(ingredientCount).map(([ingredient, count]) => (
                            <ListItem key={ingredient}>
                                {ingredient} - {count} times
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Box display="flex" justifyContent="space-between" mt={3}>
                <Button variant="outlined" onClick={handleBack}>
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default FavoritesPage;
