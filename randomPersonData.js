var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');
var faker = require('faker');
faker.locale = "en_CA";

var completeListPersonEntities = [];
var finalListPersonEntities = [];

var masterListJSON = {
    JSON_list: []
};


const fakePeople = (numOfFakePersons)=>{
    for (let i = 0; i < numOfFakePersons; i++){

        completeListPersonEntities[i] = {
        name: faker.name.findName(),
        dateOfBirth: faker.date.past(),
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
            locale: "Domestic",
            institution: "TD",
            transitNum: faker.finance.routingNumber(),
            accountNum: faker.finance.account(),
            status: "Active",
        },
        dateRange: "2020-2021"
    };
    }
    //finalListPersonEntities = JSON.parse(completeListPersonEntities);
    return completeListPersonEntities;
}

let personEntities = fakePeople(5000);

// const insertDataIntoMasterList = (data) => {
//     for (elem of data["data-set"].record) {
//         var entity = { name: elem.Entity ? elem.Entity : elem.GivenName +  " " + elem.LastName,
//                        date: elem.DateOfBirth,
//                        link : "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng",
//                        "address": {
//                         streetNum: faker.datatype.number(),
//                         street: faker.address.streetName(),
//                         city: faker.address.cityName(),
//                         prov: faker.address.state(),
//                         postal: faker.address.zipCodeByState()
//                     },
//                 };

//         masterListJSON.JSON_list.push(entity);
//     }
// }

// axios({
//     method: 'get',
//     url: 'https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml'
//     })
//     .then(function (response) {
//         data = JSON.parse(xmlParser.toJson(response.data));
//         insertDataIntoMasterList(data);
//     });






app.get("/", (req, res) => {

    if (!res.headersSent) res.status(200).send({
        jSON_list : personEntities
    })

})
//To start server
app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});