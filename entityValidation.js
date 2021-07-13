const mongoose = require("mongoose");

let entity = new mongoose.Schema({
    fullName: {type: String, required:[true,'Field is mandatory']},
    dateOfBirth: {type: String, required:[true,'Field is mandatory']},
    telephoneNumber: {type: Number, required:[true,'Field is mandatory'],maxlength :[20,'Invalid format']},
    //Remember to put constraint for dashes and brackets in phone num
    telephoneNumberExt: {type: Number, required:[true,'Invalid format'],maxlength :[10,'Invalid format']},
    //Add constraint for great than 10 numbers for ext

    address: {
        streetNum: {type: Number, required: true},
        street: {type: String, required: true},
        city: {type: String, required: true},
        prov: {type: String, required: true},
        postal: {type: String, required: true}
    },
    person_id: {
        idType: {type: String, required: true},
        idNumber: {type: Number, required: true},
        idJuristiction: {type: String, required: true}
    },
    accountInfo: {
        locale : {type: String, required: true},
        institution : {type: String, required:[true, 'FINTRAC does not have this location on file for this reporting entity.']} ,
        // add check for whether it is valid branch and it is in canada
        transitNum : {type: Number, required: true},
        accountNum : {type: Number, required: true},
        status : {type: String, required: true}
    },
    dateRange: {type: String, required: true}
});

//Possibly add activity sector and attempted transactions

module.exports = {
    entity 
};


