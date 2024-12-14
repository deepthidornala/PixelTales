import mongoose from 'mongoose';

const connectDB = async (url) => {
  try {
    mongoose.set('strictQuery', true); // Optional based on desired behavior
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message || err);
    process.exit(1); // Optional: Exit the process if the connection fails
  }

  // Debugging events for connection lifecycle
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
  });
};

export default connectDB;
