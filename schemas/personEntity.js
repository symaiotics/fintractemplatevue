var mongoose = require('mongoose');

var personEntity = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    link: {type: String, required: true},
    address: {
        streetNum: {type: Number, required: true},
        street: {type: String, required: true},
        city: {type: String, required: true},
        prov: {type: String, required: true},
        postal: {type: String, required: true}
    },
    person_id: {
        idType: {type: String, required: true},
        idNumber: {type: Number, required: true} ,
        idJuristiction: {type: String, required: true}
    },
    accountInfo: {
        locale : {type: String, required: true},
        institution : {type: String, required: true},
        transitNum : {type: Number, required: true},
        accountNum : {type: Number, required: true},
        status : {type: String, required: true}
    },
    dateRange: {type: String, required: true}
});

module.exports = {
    personEntity 
};