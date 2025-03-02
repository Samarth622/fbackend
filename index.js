import app from './app.js';
import db from './db/db.js';

const PORT = process.env.PORT || 3000;

db.query('SELECT 1')
  .then(() => {
    console.log('Database connected successfully');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });