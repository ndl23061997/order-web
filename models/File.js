const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    owner : mongoose.Schema.Types.ObjectId, // User id
    subOwner : [mongoose.Schema.Types.ObjectId],
    filename : String,
    path : String,
    type : String, // Loai file
    of : String,
    isPublic : Boolean, // Co phai public khong
    created : Date
});

var File = mongoose.model('File', schema);
File.methods = {};

File.methods.addFile = (File) => {
    return new File(File).save();
};

// export module
module.exports = File;