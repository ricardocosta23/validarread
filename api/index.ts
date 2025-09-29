
import express from "express";
import routes from '../dist/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes
registerRoutes(app);

// Export for Vercel
export default app;
