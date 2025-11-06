require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  await Lesson.deleteMany({});
  await Lesson.insertMany([
    { topic: 'Football Training', price: 15, location: 'Sports Hall A', spaces: 5, image: 'Football-Training.jpg' },
    { topic: 'Tennis Coaching', price: 12, location: 'Court 2', spaces: 5, image: 'Tennis-Coaching.jpg' },
    { topic: 'Volleyball Practice', price: 10, location: 'Gym Court 1', spaces: 5, image: 'Volleyball-Practice.jpg' },
    { topic: 'Basketball Skills', price: 14, location: 'Sports Hall B', spaces: 5, image: 'Basketball-Skills.jpg' },
    { topic: 'Swimming Basics', price: 18, location: 'Pool Complex', spaces: 5, image: 'Swimming-Basics.jpg' },
    { topic: 'Table Tennis Club', price: 8, location: 'Activity Room 3', spaces: 5, image: 'Table-Tennis-Club.jpg' },
    { topic: 'Badminton Coaching', price: 11, location: 'Sports Hall C', spaces: 5, image: 'Badminton-Coaching.jpg' },
    { topic: 'Yoga Stretch', price: 13, location: 'Wellness Room', spaces: 5, image: 'Yoga-Stretch.jpg' }
  ]);

  console.log('Seeded lessons');
  await mongoose.disconnect();
};

seed().catch(e => { console.error(e); process.exit(1); });
