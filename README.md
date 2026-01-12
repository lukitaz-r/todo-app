# 📝 Next.js To-Do App with Advanced Animations & Redux

A modern, full-stack Task Management application built with **Next.js 15 (App Router)**, **Redux Toolkit**, and **MongoDB**. It features advanced UI animations, dynamic pagination, and a device-based identification system without traditional login.

Una aplicación moderna de gestión de tareas "Full-Stack" construida con **Next.js 15**, **Redux Toolkit** y **MongoDB**. Cuenta con animaciones UI avanzadas, paginación dinámica y un sistema de identificación basado en dispositivos sin login tradicional.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## ✨ Key Features / Características Clave

### 🚀 Advanced UI & Animations (Animaciones y UI Avanzada)
*   **Snapshot Pagination:** Smooth page transitions using a dual-render snapshot technique. No flickering or ghost elements. / Transiciones de página suaves usando técnica de doble renderizado. Sin parpadeos.
*   **Responsive Animations:**
    *   **Desktop:** "Paper Fall" effect (pages drop down/land from above). / Efecto "Caída de papel".
    *   **Mobile:** "Swipe" effect (lateral sliding). / Efecto "Deslizar".
*   **Dynamic Pagination:** Automatically calculates items per page based on screen height. / Calcula automáticamente los items por página según la altura de la pantalla.
*   **Smooth Deletion:** Items collapse fluidly when deleted, allowing the list to refill automatically. / Los items colapsan fluidamente al borrarse.

### 🛡️ Security & Performance (Seguridad y Rendimiento)
*   **Rate Limiting:** API protected against spam (10 tasks/minute per IP). Visual feedback with countdown in UI. / API protegida contra spam (10 tareas/minuto por IP). Feedback visual con cuenta regresiva.
*   **Cookie-based Auth:** Uses a `deviceId` cookie to persist user tasks without requiring account creation. / Usa una cookie `deviceId` para persistir tareas sin crear cuenta.
*   **Task Limit:** Caps user content at 20 pages to prevent database abuse. / Limita el contenido a 20 páginas para prevenir abuso.

### 🏗️ Architecture (Arquitectura)
*   **Full-Stack:** Integrated API Routes (`src/app/api/data`) handling CRUD operations. / Rutas API integradas manejando operaciones CRUD.
*   **State Management:** Redux Toolkit for predictable state updates and async thunks. / Redux Toolkit para gestión de estado predecible y thunks asíncronos.
*   **Database:** MongoDB with Mongoose ODM (Serverless connection caching). / MongoDB con Mongoose (Caché de conexión optimizado para serverless).

## 🛠️ Installation & Setup / Instalación y Configuración

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/todo-app.git
    cd todo-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure / Estructura del Proyecto

```
src/
├── app/
│   ├── api/data/       # Backend API Routes (GET, POST, PUT, DELETE)
│   ├── ui/             # React Components & Modules
│   │   ├── components/ # Atomic components (Modals, Inputs)
│   │   └── modules/    # Complex widgets (TaskBoard)
│   └── page.tsx        # Main Entry Point & Layout Controller
├── lib/
│   ├── features/       # Redux Slices (Logic)
│   ├── db.ts           # Database Connection
│   └── store.ts        # Redux Store Config
└── models/             # Mongoose Schemas (Task.ts)
```

## 🧠 Technical Details / Detalles Técnicos

### Snapshot Animation Logic
To achieve smooth pagination without layout shifts, `TaskBoard.tsx` maintains a `renderedPage` state. When navigation occurs:
1.  `renderedPage` holds the *old* page content (frozen).
2.  `currentPage` prop updates to the *new* page content.
3.  Both are rendered simultaneously in the same container.
4.  CSS animations (`paperFall`/`paperLand`) play based on direction.
5.  On `animationEnd`, the old page is removed from the DOM.

### Rate Limiting Strategy
The API uses an in-memory `Map` to track request counts by IP address.
*   **Window:** 60 seconds.
*   **Limit:** 10 requests.
*   **Response:** Returns `429 Too Many Requests` with a JSON payload containing the remaining cooldown time, which the frontend displays in the error modal.

---
Built with ❤️ by Luca Ramirez