const mongoose = require('mongoose');
require('dotenv').config();

var db_url = process.env.DATABASE_URL;
// Connect mongoose
mongoose.connect(db_url, {useNewUrlParser: true}, (err, succ) => {
    if(!err) console.log('database connect success');
});

var Types = {};

Types.email = {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
        validator: (v) => {
            let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;
            return emailRegex.test(v);
        },
        message: props => `${props.value} is not a valid Email!`
    }
}

Types.phone = {
    type: String,
    required: [true, 'User phone number required']
}

Types.image = {
    type : {
        type : String,
        default : 'image',
        required : true
    }, 
    path :  String
}

Types.password = {
    type : String,
    required : [true, 'Password not empty!']
}

module.exports = {
    Types,
    mongoose
}