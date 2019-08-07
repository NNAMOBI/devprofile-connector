// connecting to the database( mongo atlas).The connection logic

const mongoose = require('mongoose');
const config = require('../node_modules/config');
const bodyParser = require('../node_modules/body-parser')





const db = config.get('mongoURI')


const connectDb = async () => {
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useCreateIndex: true
        });

        
        console.log('mongodb connected....')
    } catch (err) {
        console.error(err.message)
        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDb;

