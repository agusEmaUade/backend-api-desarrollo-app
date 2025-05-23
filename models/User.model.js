var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    date: Date
})

UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema);