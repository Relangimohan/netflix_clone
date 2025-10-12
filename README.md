# netflix_clone
Netflix {
"name": "mean-netflix-backend",
"version": "1.0.0",
"main": "server.js",
"scripts": {
"start": "node server.js",
"dev": "nodemon server.js",
"seed": "node seed.js"
},
"dependencies": {
"bcryptjs": "^2.4.3",
"cors": "^2.8.5",
"dotenv": "^16.0.3",
"express": "^4.18.2",
"jsonwebtoken": "^9.0.0",
"mongoose": "^7.3.1",
"multer": "^1.4.5-lts.1"
},
"devDependencies": {
"nodemon": "^2.0.22"
}
}MONGO_URI=mongodb://localhost:27017/mean_netflix
JWT_SECRET=change_this_to_a_secure_random_value
PORT=4000                                                const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// static folders for uploaded posters and videos
app.use('/uploads', express.static('uploads'));
app.use('/videos', express.static('videos'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT`));                                               const mongoose = require('mongoose');

module.exports = async function() {
try {
await mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
console.log('MongoDB connected');
} catch (err) {
console.error(err.message);
process.exit(1);
}
};                                                      const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
role: { type: String, default: 'user' },
});

module.exports = mongoose.model('User', UserSchema);                                            const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
genres: [String],
year: Number,
duration: Number, // minutes
poster: String, // URL / path
video: String, // URL / path to mp4
createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Movie'MovieSchema);                                   const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
const header = req.header('x-auth-token') || req.header('authorization');
if (!header) return res.status(401).json({ msg: 'No token, authorization denied' });

const token = header.replace('Bearer ', '');
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded.user;
next();
} catch (err) {
res.status(401).json({ msg: 'Token is not valid' });
}
};                                                      const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;                                                 const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
const { name, email, password } = req.body;
try {
let user = await User.findOne({ email });
if (user) return res.status(400).json({ msg: 'User already exists' });

user = new User({ name, email, password });
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
await user.save();

const payload = { user: { id: user.id } };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token });
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
};

exports.login = async (req, res) => {
const { email, password } = req.body;
try {
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

const payload = { user: { id: user.id } };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token });
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
};

exports.me = async (req, res) => {
try {
const user = await User.findById(req.user.id).select('-password').populate('watchlist');
res.json(user);
} catch (err) {
console.error(err.message);
res.status(500).send('Server error');
}
};                                                      const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const movieController = require('../controllers/movieController');

// multer config for poster upload
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/');
},
filename: function (req, file, cb) {
const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
cb(null, unique + '-' + file.originalname);
}
});
const upload = multer({ storage });

router.get('/', movieController.list);
router.get('/:id', movieController.getById);
router.post('/', auth, upload.single('poster'), movieController.create); // protected
router.post('/:id/watchlist', auth, movieController.toggleWatchlist);

module.exports = router;                                                 const Movie = require('../models/Movie');
const skip = (page - 1) * limit;
const movies = await Movie.find(filter).skip(skip).limit(parseInt(limit));
const total = await Movie.countDocuments(filter);
res.json({ movies, total });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
};

exports.getById = async (req, res) => {
try {
const movie = await Movie.findById(req.params.id);
if (!movie) return res.status(404).json({ msg: 'Not found' });
res.json(movie);
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
};

exports.create = async (req, res) => {
try {
const { title, description, genres, year, duration, video } = req.body;
const poster = req.file ? `/uploads/${req.file.filename}` : req.body.poster;
const movie = new Movie({
title,
description,
genres: genres ? (Array.isArray(genres) ? genres : genres.split(',').map(g => g.trim())) : [],
year: year ? parseInt(year) : undefined,
duration: duration ? parseInt(duration) : undefined,
poster,
video,
});
await movie.save();
res.json(movie);
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
};

exports.toggleWatchlist = async (req, res) => {
try {
const user = await User.findById(req.user.id);
if (!user) return res.status(404).json({ msg: 'User not found' });
const movieId = req.params.id;
const exists = user.watchlist.some(id => id.toString() === movieId);
if (exists) user.watchlist.pull(movieId);
else user.watchlist.push(movieId);
await user.save();
res.json({ watchlist: user.watchlist });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
};                                                      const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

async function seed() {
try {
await mongoose.connect(process.env.MONGO_URI);
await Movie.deleteMany({});
const data = [
{ title: 'Sample Movie 1', description: 'Action packed sample movie', genres: ['Action'], year: 2020, duration: 110, poster: '/assets/poster1.jpg', video: '/videos/sample1.mp4' },
{ title: 'Sample Movie 2', description: 'Romantic sample', genres: ['Romance'], year: 2019, duration: 95, poster: '/assets/poster2.jpg', video: '/videos/sample2.mp4' }
];
await Movie.insertMany(data);
console.log('Seeded movies');
process.exit(0);
} catch (err) {
console.error(err);
process.exit(1);
}
}

seed();                                                     "dependencies": {
"@angular/animations": "^16.2.0",
"@angular/common": "^16.2.0",
"@angular/compiler": "^16.2.0",
"@angular/core": "^16.2.0",
"@angular/forms": "^16.2.0",
"@angular/platform-browser": "^16.2.0",
"@angular/platform-browser-dynamic": "^16.2.0",
"@angular/router": "^16.2.0",
"rxjs": "^7.8.0",
"tslib": "^2.6.0",
"zone.js": "^0.12.0"
}                                                       import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { PlayerComponent } from './components/player/player.component';
import { AuthComponent } from './components/auth/auth.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';

import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
declarations: [
    
