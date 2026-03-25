const express = require('express');
const app = express();
const Path = require('path');
require('dotenv').config();
const dbConnection = require('./config/dbConnection');
const inputRouter  = require('./routes/inputRoutes');
const cors = require('cors');

app.use(cors({
  origin: "http://localhost:5174"
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(Path.join(__dirname + 'public')));

app.use('/api/v1', inputRouter);

app.get('/', (req, res) => {
    res.send("Express Server is Running");
})

app.listen(3000, () => {
    console.log("connected");
})