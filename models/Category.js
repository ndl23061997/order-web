const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const validate = require('../helpers/Validator');

var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    isShow : Boolean
});
var Category = {};
Category = mongoose.model('Category', schema);
Category.methods = {};

// Thêm category
function add(name, parentId) {
    let data = {};
    if (name) data.name = name;
    if (parentId) data.parentId = parentId;
    data.isShow = true;
    let category = new Category(data);
    return category.save();
}

// Chỉnh sửa
async function edit(id, name, parentId) {
    let data = {};
    if (name) data.name = name;
    if (parentId) data.parentId = parentId;
    return Category.updateOne({
        _id: id
    }, data);
}

async function remove(_id) {
    return Category.deleteOne({
        _id: id
    });
}

// Lấy danh sách theo parenId
async function getList(parentId, from, page) {
    from = Number(from);    
    page = Number(page);
    let query = validate.validateRemove({parentId}, [undefined, 'all'])
    if(parentId === 'root') query.parentId = null;
    console.log(query);
    let result =  Category.find(query);
    result.populate('parentId')
    result.skip(from)
    result.limit(page);

    return result.exec();
}

async function setShow(ids, isShow) {
    return Category.updateMany({_id : {$in : ids}}, {isShow : isShow});
}

Category.methods.getList = getList;
Category.methods.remove = remove;
Category.methods.add = add;
Category.methods.edit = edit;
Category.methods.setShow = setShow;

// export module
module.exports = Category;