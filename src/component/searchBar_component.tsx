import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, Box, Typography } from '@mui/material';
import { fetchMealsByCategory } from '../api/mealApi'; // Використовуємо існуючий API

const SearchWithDebounce: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [meals, setMeals] = useState<any[]>([]);

    useEffect(() => {
        const debounceTimer = setTimeout(async () => {
            if (query) {
                setLoading(true);
                try {
                    const response = await fetchMealsByCategory('All', 1, 100, query);
                    const filteredMeals = response.meals.filter((meal: any) =>
                        meal.strMeal.toLowerCase().includes(query.toLowerCase())
                    );
                    setMeals(filteredMeals);
                } finally {
                    setLoading(false);
                }
            } else {
                setMeals([]);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    return (
        <Box>
            <TextField
                label="Search Recipes"
                variant="outlined"
                fullWidth
                value={query}
                onChange={(e) => {
                    e.preventDefault();
                    setQuery(e.target.value)
                }}
            />
            {loading ? (
                <Box mt={2} display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Box mt={2}>
                    {meals.length > 0 ? (
                        meals.map((meal: any) => (
                            <Typography key={meal.idMeal}>{meal.strMeal}</Typography>
                        ))
                    ) : (
                        query && <Typography>No results found</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default SearchWithDebounce;
