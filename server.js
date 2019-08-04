const express = require('express');
const mongoose = require('mongoose');

const app = express();
// process.env.PORT is responsible for searching out on heroku environment the PORT no ,hence default to local PORT 5000
const PORT = process.env.PORT || 5000;



app.get('/', (req, res) => {
    res.send('API running')
});


app.listen(PORT, (error) => {
    if (error) {
        console.log('error in listener')
    } else {
        console.log(`server started on  port ${PORT}`)
    }
});