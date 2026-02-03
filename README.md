# Menu4MeNU

Menu4MeNU is a smart recipe, grocery, and meal-planning assistant designed to make daily cooking simple, efficient, and cost-effective. It helps households answer the age-old question: *“What should I cook today, what do I need to buy, and how can I do it without wasting time or money?”*

With Menu4MeNU, you can quickly see which meals you can make with ingredients you already have, discover new recipes tailored to your nutrition goals, find the cheapest places to buy missing ingredients, and share your favorites with other members of your household—all in one organized platform.

---

## Features

- **Smart Recipe Suggestions** – Get recipe recommendations based on your pantry items.  
- **Shared Household Support** – Sync recipes and favorites with everyone in your household.  
- **Price Searching** – Automatically find the most cost-effective sources for ingredients.  
- **Favorites & Personalization** – Save your favorite meals and access them anytime.  
- **Nutrition-Focused** – Filter meals according to your dietary preferences and nutrition goals.  
- **Search & Filter** – Easily search for recipes by name, category, or nutrients.  
- **Image Caching** – Fast-loading recipe images using caching techniques.  
- **Responsive UI** – Works seamlessly on mobile and desktop.  

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Router, Lucide Icons  
- **Backend**: Java, Spring Boot, PostgreSQL, Tailscale for secure networking  
- **Authentication**: Supabase (email/password authentication, profile management)  
- **APIs**: REST endpoints for recipes, users, favorites, and household sync  
- **State Management**: React Context API for auth, favorites, and household data  

---

## Architecture Overview

- **Frontend** handles UI, recipe search/filter, favorites, and household sharing.  
- **Backend (Spring Boot)** provides secure API endpoints for recipes, favorites, household sync, and price lookups.  
- **PostgreSQL** stores recipes, user profiles, household info, and favorite recipes.  
- **Supabase** manages authentication and user metadata.  
- **Tailscale** ensures secure private network access for backend services.  

---

## API Endpoints

- **GET /api/foods**: Fetch all recipes
- **GET /api/foods/:id**: Fetch a single recipe by ID
- **GET /api/users/:userId/favorites**: Fetch a user’s favorites
- **POST /api/users/:userId/favorites/:recipeId**: Add a recipe to favorites

---

## Getting Started

### Prerequisites

- Node.js >= 18  
- Java 17+  
- PostgreSQL database  
- [Supabase](https://supabase.com/) account for authentication  
- [Tailscale](https://tailscale.com/) installed for secure private network access  

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/anushkatankala/Menu4MeNU.git
cd Menu4MeNU
```

2. **Install Dependenices**

```bash
cd frontend/nutrient-navigator-main
npm install

cd ../backend/demo
./mvnw clean install
```

3. **Configure .env File**
```bash
# Frontend
VITE_API_BASE_URL=http://localhost:8080

# Backend
DATABASE_URL=your_db_url
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
PORT=8080
```

4. **Run Backend and Frontend**
```bash
cd backend/demo
./mvnw spring-boot:run

cd frontend/nutrient-navigator-main
npm run dev
```

5. **Visit Locally Hosted Server**
```bash
http://localhost:5173
```



