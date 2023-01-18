import mongoose from 'mongoose';
import 'colors';

import app from './app.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 🔥! Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

// database local
const db = process.env.DATABASE_LOCAL;

// atlas mongo uri
const mongouri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(mongouri)
  .then(() => console.log(`Connected to MongoDB → ${mongouri}`.gray.bold));

app.set('port', process.env.PORT || 9090);

const server = app.listen(app.get('port'), () => {
  console.log(`Server listening on port → ${server.address().port}`.blue.bold);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 🔥! Shutting down...'.red.bold);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
