const mongoose = require('mongoose');

const connectDB = async() => {

    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`Our database is connected Successfully 👍 : at ${conn.connection.host} `);

    } catch (error) {
        console.log(err);
        process.exit();
    }
}

module.exports = connectDB;