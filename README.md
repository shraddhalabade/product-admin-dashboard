# Product Admin Dashboard

A responsive Product Admin Dashboard built as a frontend assignment using Next.js, React, Tailwind CSS, Axios, and the DummyJSON API.

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios
* DummyJSON API
* LocalStorage
* Git & GitHub

## Features

### Authentication

* Login page with validation and error handling
* Protected product pages
* Logout functionality
* Unauthenticated users cannot access the product dashboard

### Product Management

* Product listing with:

  * Image
  * Title
  * Category
  * Price
  * Rating
  * Stock
* Responsive desktop table and mobile card layout
* Product details page
* Add product
* Edit product
* Delete product

### Search, Filter & Sorting

* Debounced product search
* Category filtering
* Sort by:

  * Price
  * Rating
  * Title

### Pagination

* API-based pagination using `limit` and `skip`
* Page numbers
* Previous/Next navigation
* Page sizes:

  * 10
  * 20
  * 50
* Displays the current result range

### Data Persistence

DummyJSON mutation APIs simulate add, edit, and delete operations but do not permanently persist the changes after refetching.

To provide a consistent working experience, locally created and modified products are stored using `localStorage` and merged with API products.

## API

This project uses the DummyJSON Products API:

* Products: `/products`
* Search: `/products/search?q=`
* Categories: `/products/categories`
* Category products: `/products/category/{category}`

All API requests are handled using Axios.

## Project Structure

```text
product-admin-dashboard/
├── app/
│   ├── login/
│   ├── products/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── services/
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shraddhalabade/product-admin-dashboard.git
```

### 2. Open the project

```bash
cd product-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open in browser

```text
http://localhost:3000
```

## Login

Use the login credentials configured in the application to access the product dashboard.

After successful login, users can access the product management pages.

## Responsive Design

The dashboard is designed to work across desktop and mobile screen sizes.

* Desktop: Product table
* Mobile: Product cards

## AI Usage

AI tools were used as a support tool during development for debugging, implementation guidance, understanding framework issues, and improving the development workflow.

The implemented functionality was integrated and tested in the project before submission.

## Assignment Status

Completed features:

* Login and validation
* Protected routes
* Logout
* Product listing
* Responsive UI
* Pagination
* Debounced search
* Category filtering
* Sorting
* Product details
* Add product
* Edit product
* Delete product
* Local persistence
* Axios API integration
