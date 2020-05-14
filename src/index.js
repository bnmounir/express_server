require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

require('./models/User');
require('./models/Track');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => console.log('connected to DB'));
mongoose.connection.on('error', (err) =>
    console.log('connection to DB failed: ', err)
);

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

app.get('/', requireAuth, (req, res) => {
    res.send(`your email is ${req.user.email}`);
});
app.listen(3003, () => console.log('server started on port:3003...'));
