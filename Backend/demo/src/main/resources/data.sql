-- Insert a recipe
INSERT INTO recipe (id, name, category) VALUES
(1, 'Spaghetti Bolognese', 'Pasta');

-- Insert an ingredient for the recipe
INSERT INTO ingredient (id, name, quantity, notes, recipe_id) VALUES
(1, 'Spaghetti', '200g', 'Cook until al dente', 1),
(2, 'Ground Beef', '150g', 'Lean beef works best', 1),
(3, 'Tomato Sauce', '100ml', 'Use fresh if possible', 1),
(4, 'Onion', '1 small', 'Chopped finely', 1),
(5, 'Garlic', '2 cloves', 'Minced', 1);
