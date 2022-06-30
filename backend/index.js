const express = require('express');
const app = express();
const mongooose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./src/config/corsOptions');
const apiRouter = require('./src/routes/index')
dotenv.config();

// mongo db connection
mongooose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log('connected to mongo db');
}
);
// app.use(cors(corsOptions));
app.use(cors({
    origin: '*'
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRouter);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);
