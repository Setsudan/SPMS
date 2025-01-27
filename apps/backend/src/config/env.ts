import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
};
