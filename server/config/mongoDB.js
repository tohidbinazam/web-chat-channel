import mongoose from 'mongoose';
import createFirstAdmin from '../utility/createFirstAdmin.js';

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connect successfully`.bgMagenta.black);
    await createFirstAdmin();
  } catch (error) {
    console.error(error.message);
  }
};

export default mongoDB;
