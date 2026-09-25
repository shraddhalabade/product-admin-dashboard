# Development Process

## 1. Project Setup

The project was initialized using Next.js with:

* TypeScript
* App Router
* Tailwind CSS
* ESLint

Axios was added for API communication.

## 2. Application Structure

The application was organized into separate areas for:

* Authentication
* Product management
* API services
* Reusable components
* Local product persistence

The Next.js App Router is used for page navigation and routing.

## 3. Authentication

A login flow was implemented with:

* Form validation
* Error handling
* Login state management
* Protected product pages
* Logout functionality

Users who are not authenticated are prevented from accessing the product management page.

## 4. Product API Integration

The DummyJSON Products API was integrated using Axios.

The application supports:

* Fetching products
* Searching products
* Fetching categories
* Filtering products by category
* Sorting products
* Product details
* Creating products
* Updating products
* Deleting products

## 5. Product Listing

The product dashboard displays:

* Product image
* Title
* Category
* Price
* Rating
* Stock

The interface provides a table layout for desktop screens and a card layout for smaller screens.

## 6. Search and Filtering

A debounced search was implemented to reduce unnecessary API requests while the user is typing.

Category filtering and sorting were also implemented to make product management easier.

## 7. Pagination

Pagination uses the API's `limit` and `skip` parameters.

The dashboard supports:

* Page navigation
* Previous/Next buttons
* Page sizes of 10, 20, and 50
* Current result range display

Search and filtering reset the pagination to the first page.

## 8. CRUD Operations

Product management functionality includes:

* Add product
* Edit product
* Delete product
* View product details

The UI updates after product operations so users can immediately see the result.

## 9. Data Persistence Challenge

One important challenge was that DummyJSON mutation endpoints simulate successful add, edit, and delete operations but do not permanently persist those changes on subsequent product fetches.

This caused locally added or modified products to disappear or revert after refreshing or refetching the product list.

### Solution

Local product data was stored using browser `localStorage`.

The application combines locally stored products with products received from the API and applies the required search, filtering, and sorting logic.

This allows the CRUD functionality to remain consistent during the user session and after page refreshes.

## 10. Responsive Design

The dashboard was tested across different screen sizes.

Desktop users receive a table-based product view, while mobile users receive a card-based layout for better usability.

## 11. Testing and Debugging

The application was tested for the main user flows, including:

* Login validation
* Protected routes
* Logout
* Product listing
* Search
* Category filtering
* Sorting
* Pagination
* Product details
* Add product
* Edit product
* Delete product
* Local persistence
* Responsive layout

Issues encountered during development were tested and corrected before submission.

## 12. AI-Assisted Development

AI tools were used as a development support tool for:

* Debugging errors
* Understanding framework behavior
* Implementation guidance
* Troubleshooting API and state-management issues
* Reviewing possible solutions

The resulting functionality was integrated into the project and manually tested before submission.
