/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Content = require('./models/Content');
require('dotenv').config();

const newContent = [
    // Latest Trailers
    {
        title: "Kalki 2898 AD Trailer",
        posterUrl: "https://i.ytimg.com/vi/kQDd1Ahgp_s/maxresdefault.jpg",
        category: "Latest Trailers",
        description: "Witness the trailer for the highly anticipated sci-fi epic, Kalki 2898 AD, starring Prabhas, Amitabh Bachchan, and Deepika Padukone.",
        videoUrl: "https://www.youtube.com/watch?v=kQDd1Ahgp_s"
    },
    {
        title: "Deadpool & Wolverine | Official Trailer",
        posterUrl: "https://i.ytimg.com/vi/73_1biulkYk/maxresdefault.jpg",
        category: "Latest Trailers",
        description: "Marvel Studios’ Deadpool & Wolverine hits theaters July 26. The two-hero team-up that will change the Marvel Cinematic Universe forever.",
        videoUrl: "https://www.youtube.com/watch?v=73_1biulkYk"
    },
     {
        title: "Grand Theft Auto VI Trailer 1",
        posterUrl: "https://i.ytimg.com/vi/QdBZY2fkU-0/maxresdefault.jpg",
        category: "Latest Trailers",
        description: "The first official trailer for Grand Theft Auto VI from Rockstar Games.",
        videoUrl: "https://www.youtube.com/watch?v=QdBZY2fkU-0"
    },
    // Top Tech Explained
    {
        title: "What Is Generative AI?",
        posterUrl: "https://i.ytimg.com/vi/G2fqAlgmoPo/maxresdefault.jpg",
        category: "Top Tech Explained",
        description: "An easy-to-understand explanation of Generative AI and how it's changing the world, from the Google Cloud Tech channel.",
        videoUrl: "https://www.youtube.com/watch?v=G2fqAlgmoPo"
    },
    {
        title: "Quantum Computing Explained",
        posterUrl: "https://i.ytimg.com/vi/JhHMJCUmq28/maxresdefault.jpg",
        category: "Top Tech Explained",
        description: "A simple explanation of the complex world of Quantum Computing and its potential to solve some of humanity's biggest problems.",
        videoUrl: "https://www.youtube.com/watch?v=JhHMJCUmq28"
    },
    // Featured Music
    {
        title: "Aavesham - Jaada | Jithu Madhavan",
        posterUrl: "https://i.ytimg.com/vi/rcNTEvwoc9o/maxresdefault.jpg",
        category: "Featured Music",
        description: "Presenting the electrifying 'Jaada' song from the blockbuster 'Aavesham', a Jithu Madhavan film. Music by Sushin Shyam.",
        videoUrl: "https://www.youtube.com/watch?v=rcNTEvwoc9o"
    }
];

const seedDB = async () => {
    await connectDB();
    try {
        console.log('Clearing existing content...');
        await Content.deleteMany({});
        console.log('Content cleared.');

        console.log('Adding new content...');
        await Content.insertMany(newContent);
        console.log('Data seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedDB();
