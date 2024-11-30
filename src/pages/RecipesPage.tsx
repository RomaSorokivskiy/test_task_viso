import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchMealsByCategory } from '../api/mealApi';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    TextField,
} from '@mui/material';
import { Meal } from '../types/Meal';
import { useSelectedMeals } from '../hooks/useSelectedMeals';
import { Link } from 'react-router-dom';

const RecipesPage: React.FC = () => {
    const [category, setCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

    const itemsPerPage = 6;


    const { selectedMeals, addMeal, removeMeal } = useSelectedMeals();

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });


    const { data, isLoading: mealsLoading } = useQuery({
        queryKey: ['meals', category, currentPage, debouncedSearchQuery],
        queryFn: () => fetchMealsByCategory(category, currentPage, itemsPerPage, debouncedSearchQuery),
    });

    const meals = data?.meals ?? [];
    const totalMeals = data?.total ?? 0;
    const totalPages = Math.ceil(totalMeals / itemsPerPage);


    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        setCategory(event.target.value);
        setCurrentPage(1);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 1000);


        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    if (categoriesLoading || mealsLoading) {
        return <div>Loading...</div>;
    }

    const toggleMealSelection = (meal: Meal) => {
        const isSelected = selectedMeals.some((m) => m.idMeal === meal.idMeal);
        if (isSelected) {
            removeMeal(meal.idMeal);
        } else {
            addMeal(meal);
        }
    };

    return (
        <Box>

            <Box display="flex" justifyContent="center" mb={3}>
                <TextField
                    label="Search Recipes"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Box>

            <Box display="flex" justifyContent="center" mb={3}>
                <Select value={category} onChange={handleCategoryChange}>
                    <MenuItem value="All">All Categories</MenuItem>
                    {categories?.map((cat: string) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={16}>
                {meals.map((meal: Meal) => (
                    <Card key={meal.idMeal}>
                        <CardMedia component="img" image={meal.strMealThumb} alt={meal.strMeal} />
                        <CardContent>
                            <Typography variant="h6">{meal.strMeal}</Typography>
                            <Button
                                variant="contained"
                                onClick={() => toggleMealSelection(meal)}
                            >
                                {selectedMeals.some((m) => m.idMeal === meal.idMeal)
                                    ? 'Deselect'
                                    : 'Select'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
                <Button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'contained' : 'outlined'}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
                <Link to="/favorites">
                    <Button variant="contained" color="primary">
                        Go to Favorites ({selectedMeals.length})
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default RecipesPage;
