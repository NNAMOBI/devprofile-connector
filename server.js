const express = require('express');
const mongoose = require('mongoose');
const connectDb = require('./config/db')



const app = express();
// process.env.PORT is responsible for searching out on heroku environment the PORT no ,hence default to local PORT 5000
const PORT = process.env.PORT || 4500;

//connect database;
connectDb();

//init middleware to parse the object of data into the req.body
app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
    res.send('API running')
});

// Define routes

app.use('/api/users', require('./config/routes/api/users'))
app.use('/api/post', require('./config/routes/api/post'))
app.use('/api/profile', require('./config/routes/api/profile'))
app.use('/api/auth', require('./config/routes/api/auth'))



app.listen(PORT, (error) => {
    if (error) {
        console.log('error in listener')
    } else {
        console.log(`server started on  port ${PORT}`)
    }
});