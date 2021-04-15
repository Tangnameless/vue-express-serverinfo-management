module.exports = app =>{
    const mongoose = require('mongoose')
    mongoose.connect('mongodb://127.0.0.1/server-data',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}



