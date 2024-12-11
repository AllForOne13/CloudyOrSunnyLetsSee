import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import routes from './routes/index.js';


dotenv.config();

// Import the routes
    const app = express();
    const PORT = process.env.PORT || 3001;

    // TODO: Serve static files of entire client dist folder
    app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'client/dist')));


// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
