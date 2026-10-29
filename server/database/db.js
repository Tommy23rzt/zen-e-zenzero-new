import mongoose from 'mongoose';

const Connection = async () => {
    const URL = process.env.MONGO_URL;
    if (!URL) {
        console.log('Error: MONGO_URL not defined in environment variables');
        return;
    }
    try {
        await mongoose.connect(URL, { useNewUrlParser: true, serverSelectionTimeoutMS: 5000 });
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error.message);
    }
};

export default Connection;