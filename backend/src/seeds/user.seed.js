import { config } from 'dotenv';
import { connectToDB } from '../lib/db.js';
import User from '../models/user.model.js';

config();

const seedUsers = [
    {
        email: 'test1@example.com',
        fullName: 'Test User 1',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        email: 'test2@example.com',
        fullName: 'Test User 2',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        email: 'test3@example.com',
        fullName: 'Test User 3',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
        email: 'test4@example.com',
        fullName: 'Test User 4',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
        email: 'test5@example.com',
        fullName: 'Test User 5',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
        email: 'test6@example.com',
        fullName: 'Test User 6',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    {
        email: 'test7@example.com',
        fullName: 'Test User 7',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
];

const seedDatabase = async () => {
    try {
        await connectToDB();

        await User.insertMany(seedUsers);
        console.log('successfully');
    } catch (error) {
        console.error('Error:', error);
    }
};

seedDatabase();
