# PICK&PAY

<small>240-124 Web Dev Module PSU</small><br>
PICK&PAY is an online IT and Office shopping

## Installation For Development

To run the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/WebDevG6/PicknPay.git
    cd PicknPay
    ```

2. **Install dependencies for frontend:**

    ```bash
    cd frontend
    npm install
    ```

3. **Install dependencies for the backend (Strapi):**

    ```bash
    cd backend
    npm install
    ```

4. **Start the frontend and backend servers:**

    - Start the frontend:

        ```bash
        cd frontend
        npm run dev
        ```

        The frontend will be available at `http://localhost:5173`.

    - Start the backend:

        ```bash
        cd backend
        npm run develop
        ```

        The Strapi admin panel will be available at `http://localhost:1337/admin`.

## Usage

-   **Application URL:** `http://localhost:5173`
-   **Strapi Admin Panel:** `http://localhost:1337/admin`

## Technologies Used

-   **Frontend:** React, TailwindCSS, Vite
-   **Backend:** Strapi
-   **Payment Gateway:** Stripe
