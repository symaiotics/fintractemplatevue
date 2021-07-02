var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');
var mongoose = require("mongoose");
var faker = require('faker');

faker.locale = "en_CA";

//Schemas
var entitySchema = require("./schemas/testEntity").entitySchema;
var MSBSchema = require("./schemas/MSBEntity").MSBSchema;
var personSchema = require("./schemas/personEntity").personEntity;

mongoose.connect('mongodb://localhost:27017/API_test', { useNewUrlParser: true, useUnifiedTopology: true }); 

var data = "";

var masterListJSON = {
    JSON_list: []
};

// DB Models
var Entity = mongoose.model("Entity", entitySchema);
var MSB_Entity = mongoose.model("MSB_Entity", MSBSchema);
var PersonEntity = mongoose.model("PersonEntity", personSchema);

// Dummy data to be add/remove from db (TESTING)
var newEntity;
var newMSB_Entity;
var newPersonEntity;

const insertDataIntoMasterList = (data) => {
    for (elem of data["data-set"].record) {
        var entity = { name: elem.Entity ? elem.Entity : elem.GivenName +  " " + elem.LastName,
                       date: elem.DateOfBirth,
                       source: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng"};

        masterListJSON.JSON_list.push(entity);
    }
}

axios({
    method: 'get',
    url: 'https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml'
    })
    .then(function (response) {
        data = JSON.parse(xmlParser.toJson(response.data));
        insertDataIntoMasterList(data);
    });

app.get("/", (req, res) => {

    if (!res.headersSent) res.status(200).send({ 
        jSON_list: [masterListJSON.JSON_list]
    })
})

app.get("/addTestEntity", (req, res) => {

    newEntity = new Entity({
        name: "John Smith",
        date: "2021/01/01",
        source: "www.google.ca"});

    Entity.insertMany(newEntity, () => {
        console.log("Added Test Entity!");
    });

    newPersonEntity = new PersonEntity({
        name: "John Cena",
        date: "2021/02/02",
        link: "www.bing.com",
        address: {
            streetNum: 13,
            street: "Sunville Drive",
            city: "Ottawa",
            prov: "ON",
            postal: "K4I9H5"
        },
        person_id: {
            idType: "Driver's License",
            idNumber: faker.finance.routingNumber() ,
            idJuristiction: faker.address.state()
        },
        accountInfo: {
            locale: "Domestic",
            institution: "TD",
            transitNum: faker.finance.routingNumber(),
            accountNum: faker.finance.account(),
            status: "Active"
        }
    });

    PersonEntity.insertMany(newPersonEntity, () => {
        console.log("Added Person Entity!");
        res.send("Added Person Entity!");
    });
})

app.get("/addMSBEntity", (req, res) => {

    newMSB_Entity = new MSB_Entity({
        registrationNumber: "M08609375",
        businessName: "ACCU-RATE CORPORATION",
        registrationStatus:{
            StatusDescriptionEnglish: "Expired",
            StatusDescriptionFrench: "Expirée"
        },
        registrationDate: "2008-07-09",
        expirationDate: "2017-01-06",
        MsbOperateName: "ACCU-RATE",
        phone: "6135965505",
        webSiteAddress: "www.accu-rate.ca",
        businessIncorporation:{
            IncorporationNumber: "4131894",
            IncorporationDate: "2003-01-01",
            IncorporationJurisdictionDescriptionEnglish: "Federal (Canada)",
            IncorporationJurisdictionDescriptionFrench: "Fédérale (Canada)"
        },
        businessActivity:[
            {
                ActivityDescriptionEnglish: "Foreign exchange dealing",
                ActivityDescriptionFrench: "Opérations de change"
            },
            {
                ActivityDescriptionEnglish: "Money transferring",
                ActivityDescriptionFrench:  "Transfert de fonds"
            }
        ],
        location: [
            {
                MainLocationIndicator: "1",
                StreetAddress: "2573 CARLING AVENUE",
                CityName: "OTTAWA",
                AlphaProvinceCode: "ON",
                PostalZipCode: "K2B7H7",
                AlphaCountryCode: "CA"
            }
        ]
    });

    MSB_Entity.insertMany(newMSB_Entity, () => {
        console.log("Added MSB Entity!");
        res.send("Added MSB Entity!");
    });
})

app.get("/deleteTestEntity", (req, res) => {
    Entity.deleteOne({name: "John Smith"}, () => {
        console.log("Deleted Entity!");
    });

    PersonEntity.deleteOne({name: "John Cena"}, () => {
        console.log("Deleted Person Entity!");
        res.send("Deleted Person Entity!");
    });
})

app.get("/deleteMSBEntity", (req, res) => {
    MSB_Entity.deleteOne({"registrationNumber": "M08609375"}, () => {
        console.log("Deleted MSB Entity!");
        res.send("Deleted MSB Entity!");
    });
})

//To start server
app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});