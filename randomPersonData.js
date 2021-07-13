var express = require("express");
var app = express();
var mongoose = require("mongoose");
let ENTITY = require("./entityValidation.js");
var faker = require('faker');
const validator = require('Validator');
faker.locale = "en_CA";

var completeListPersonEntities = [];
var finalListPersonEntities = [];

let db = mongoose.connection;
//connect with local mongodb
// mongoose.connect("mongodb://localhost:27017/products", {
// useNewUrlParser: true,
// useUnifiedTopology: true
// });


const fakePeople = (numOfFakePersons)=>{
    for (let i = 0; i < numOfFakePersons; i++){
        completeListPersonEntities[i] = {
        fullName : faker.name.findName(),
        dateOfBirth: faker.date.past(),
        telephoneNumber : faker.phone.phoneNumber(),
        address: {
            streetNum: faker.datatype.number(),
            street: faker.address.streetName(),
            city: faker.address.cityName(),
            prov: faker.address.state(),
            postal: faker.address.zipCodeByState(),
        },
        id: {
            idType: "Driver's License",
            idNumber: faker.finance.routingNumber(),
            idJuristiction: faker.address.state(),
        },
        accountInfo: {
            locale: "CA",
            institution: faker.company.companyName() + " Bank ",
            transitNum: faker.finance.routingNumber(),
            accountNum: faker.finance.account(),
            status: "Active",
        },
        dateRange: faker.date.past() + " - " + faker.date.recent()
    };
    
    }
    return completeListPersonEntities;
}



var nameValid = { fullName : 'required' };
var dobValid = { dateOfBirth : 'required|string' };
var teleValid = {telephoneNumber : 'required'};
const messages = {
    required: 'Field is mandatory'
};

const checkValid = () =>{
    let personEntities = []
    personEntities = fakePeople(5000);
    var arrayLength = personEntities.length;
    for(var i = 0; i < arrayLength; i++){
        const valName = validator.make(personEntities[i]['fullName'],nameValid,messages);
        const valBirth = validator.make(personEntities[i]['dateOfBirth'],nameValid,messages);
        const valTele = validator.make(personEntities[i]['telephoneNumber'],nameValid,messages);
        console.log(personEntities[i]['fullName']);
        if(!valName.passes()){
            personEntities[i]['fullName'] = valName.customMessages;
        }
        if(!valBirth.passes()){
            personEntities[i]['dateOfBirth'] = valBirth.customMessages;
        }
        if(!valTele.passes()){
            personEntities[i]['telephoneNumber'] = valTele.customMessages;
        }
        else{
            continue;
        }
    }
    return personEntities;
}

let finalPersonEntities = checkValid();




app.get("/", (req, res) => {

    if (!res.headersSent) res.status(200).send({
        jSON_list : finalPersonEntities
    })

})
//To start server
app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});