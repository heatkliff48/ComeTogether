require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const morgan = require('morgan');
const path = require('path');

const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const eventRouter = require('./routes/eventRouter');

hbs.registerPartials(path.join(__dirname, 'views/parties'));

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'sesid',
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: 'mlkfdamfdskjnfsgnjk',
    resave: false,
  })
);
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }

  next();
});
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/event', eventRouter);

app.listen(PORT);
