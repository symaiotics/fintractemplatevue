var mongoose = require('mongoose');

var entitySchema = new mongoose.Schema({
    name: String,
    date: String,
    source: String
});

module.exports = {
    entitySchema 
};