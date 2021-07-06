var mongoose = require('mongoose');

var personEntity = new mongoose.Schema({
    name: String,
    date: String,
    link: String,
    address: {
        streetNum: String,
        street: String,
        city: String,
        prov: String,
        postal: String
    },
    person_id: {
        idType: String,
        idNumber: String ,
        idJuristiction: String
    },
    accountInfo: {
        locale : String,
        institution : String,
        transitNum : String,
        accountNum : String,
        status : String
    },
    dateRange: String
});

module.exports = {
    personEntity 
};