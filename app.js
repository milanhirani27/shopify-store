// const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.NODE_ENV || 3000;

//routes
const router = require('./routes/index');
app.use('/', router)

//app listen
app.listen(port, () => {
    console.log(`server started on ${port}`);
})