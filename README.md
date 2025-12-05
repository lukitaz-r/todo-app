# TO-DO App

A modern, responsive task management application built with Next.js 15, React 19, Redux Toolkit, and MongoDB.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🚀 Features

### Task Management
- **Create Tasks** - Add new tasks with a name and description
- **Edit Tasks** - Modify existing tasks through an intuitive modal
- **Complete Tasks** - Mark tasks as complete with a satisfying animation
- **Delete Tasks** - Remove individual tasks or delete all at once
- **Persistent Storage** - Tasks are stored in MongoDB and persist across sessions

### User Experience
- **Device-based Identification** - Uses browser cookies to identify users without requiring login
- **Responsive Design** - Fully responsive UI that works on mobile, tablet, and desktop
- **Smooth Animations** - Fade in/out and scale animations for modals and task completion
- **Real-time Updates** - Instant UI updates using Redux state management

### Technical Features
- **Next.js 15 App Router** - Modern React Server Components architecture
- **React 19** - Latest React with improved performance
- **Redux Toolkit** - Predictable state management with async thunks
- **MongoDB with Mongoose** - Robust database with schema validation
- **TypeScript** - Full type safety across the application
- **Turbopack** - Fast development builds

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Full-stack React framework |
| React 19 | UI library |
| Redux Toolkit | State management |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| TypeScript | Type safety |
| CSS Modules | Scoped styling |

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lukitaz-r/todo-app.git
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── data/          # REST API routes
│   ├── types/             # TypeScript interfaces
│   └── ui/
│       ├── css/           # CSS Modules
│       └── modules/       # React components
├── lib/
│   ├── features/
│   │   └── tasks/         # Redux slice
│   ├── cookieUtils.ts     # Device ID management
│   ├── db.ts              # MongoDB connection
│   └── store.ts           # Redux store
└── models/
    └── Task.ts            # Mongoose model
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data` | Fetch all tasks for current user |
| POST | `/api/data` | Create a new task |
| PUT | `/api/data` | Update an existing task |
| DELETE | `/api/data?id={id}` | Delete a specific task |
| DELETE | `/api/data` | Delete all tasks for current user |

## 🎨 Features in Detail

### Responsive Breakpoints
- **Mobile**: < 480px
- **Small Tablet**: 480px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: ≥ 1280px

### Security
- Tasks are isolated per device using UUID-based cookies
- MongoDB queries are scoped to user's device ID
- Input validation on both client and server

## 🚀 Deployment

The app can be deployed to Vercel with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add your `MONGODB_URI` environment variable in Vercel's project settings.

## 👨‍💻 Author

**Luca Ramirez**
- LinkedIn: [lukitaz-r](https://www.linkedin.com/in/lukitaz-r/)
- GitHub: [lukitaz-r](https://github.com/lukitaz-r)
- Portfolio: [lucaramirez.vercel.app](https://lucaramirez.vercel.app/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

© 2025 Luca Ramirez - Barranqueras, Chaco, Argentina
