import { config } from 'dotenv';
import { connectToDB } from '../lib/db.js';
import User from '../models/user.model.js';

config();

const seedUsers = [
    {
        email: 'test1@example.com',
        fullName: 'TestUser1',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        email: 'test2@example.com',
        fullName: 'TestUser2',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        email: 'test3@example.com',
        fullName: 'TestUser3',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
        email: 'test4@example.com',
        fullName: 'TestUser4',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
        email: 'test5@example.com',
        fullName: 'TestUser5',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
        email: 'test6@example.com',
        fullName: 'TestUser6',
        password: '123456',
        profilePic: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    {
        email: 'test7@example.com',
        fullName: 'TestUser7',
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
