# BAMITO - Badminton E-commerce Frontend ✨

![BAMITO Homepage Screenshot](https://i.imgur.com/gK6nJ4w.png) <!-- Replace with a high-quality screenshot of your running app -->

**Live Demo:** [https://bamito-shop.vercel.app](https://bamito-shop.vercel.app) <!-- Replace with your actual deployment URL -->

---

## 📖 About The Project

BAMITO is a modern, feature-rich, and high-performance e-commerce platform dedicated to badminton enthusiasts. This repository contains the complete frontend application, built with the latest industry-standard tools and best practices, including the Next.js App Router, Redux Toolkit for state management, and a fully type-safe codebase with TypeScript.

This frontend is designed to be a "client" for the corresponding **[BAMITO Backend API](https://github.com/ngophong010/bamito-backend)**.

### Key Features

-   **Modern Architecture:** Built on the Next.js 14 App Router for optimal performance, SEO, and developer experience.
-   **State Management:** Centralized and predictable state management powered by Redux Toolkit.
-   **Type Safety:** Fully typed with TypeScript to prevent bugs and improve code quality.
-   **Responsive Design:** A clean, user-friendly interface that works beautifully on desktop, tablet, and mobile devices.
-   **Core E-commerce Functionality:**
    -   Product Browsing, Searching, and Filtering
    -   User Authentication (Register, Login, Session Management)
    -   Shopping Cart with Persistent State
    -   User Profiles with Order History and Address Management
    -   Product Reviews and Favourites
-   **SEO Optimized:** Server-side rendering with dynamic metadata and JSON-LD structured data for rich search engine results.

---

## 🛠️ Tech Stack

This project is built with a modern, professional technology stack:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/)
-   **Styling:** [SCSS/Sass](https://sass-lang.com/)
-   **Data Fetching:** [Axios](https://axios-http.com/)
-   **UI Components:** [Material-UI](https://mui.com/) (for icons and grid)
-   **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)
-   **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   A running instance of the **[BAMITO Backend API](https://github.com/ngophong010/bamito-backend)**.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ngophong010/bamito-frontend.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd bamito-frontend
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Set up environment variables:**
    -   Create a copy of the example environment file.
        ```sh
        cp .env.example .env.local
        ```
    -   Open the newly created `.env.local` file and fill in the required values.

5.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

### Environment Variables

You need to create a `.env.local` file in the root of the project and add the following variables. These are essential for the application to connect to the backend and other services.

| Variable                  | Description                                                                 | Example Value                       |
| ------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL`     | The base URL of your running backend server.                                | `http://localhost:8080/api/v1`      |
| `NEXT_PUBLIC_SITE_URL`    | The full public URL of your frontend. Used for SEO metadata.                | `http://localhost:3000`             |
| `NEXT_PUBLIC_GTM_ID`      | Your Google Tag Manager container ID (optional).                            | `GTM-XXXXXXX`                       |

---

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm start`: Starts the production server.
-   `npm run lint`: Runs the linter to check for code quality issues.

---

## 📂 Project Structure

The project follows a modern, feature-sliced architecture to ensure scalability and maintainability.

/src
├── /app/ # Next.js App Router: Contains all pages and layouts.
├── /components/ # Reusable, "dumb" UI components (Button, Card, Loading).
├── /contexts/ # React Context providers (e.g., ThemeContext).
├── /hooks/ # Custom React hooks (e.g., useAuth, useDebounce).
├── /layout/ # Major layout components (Header, Footer, Sidebar).
├── /redux-toolkit/ # All Redux Toolkit slices, the store, and hooks.
├── /services/ # The API layer for all communication with the backend.
├── /styles/ # Global SCSS styles, variables, and mixins.
├── /types/ # Shared TypeScript interfaces and type definitions.
└── /utils/ # Pure helper functions (formatters, validators).


---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.