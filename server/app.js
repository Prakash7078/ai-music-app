const cors = require('cors');
const express = require('express');

const { errorMiddleware } = require('./middleware/error.middleware');
const { loggerMiddleware } = require('./middleware/logger.middleware');
const { notFoundMiddleware } = require('./middleware/not-found.middleware');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
