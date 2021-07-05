var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');
var mongoose = require("mongoose");
var faker = require('faker');

mongoose.connect('mongodb://localhost:27017/API_test', { useNewUrlParser: true, useUnifiedTopology: true });

// DB Models
var MSB_Entity = mongoose.model("MSB_Entity", MSBSchema);
var PersonEntity = mongoose.model("PersonEntity", personSchema);

// Dummy data to be add/remove from db (TESTING)
var newMSB_Entity;
var newPersonEntity;

var data = "";
var finalList=[];

var masterListJSON = {
    JSON_list: []
};

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

let lteListData= []
let filteredData = [];

const listLink = 'https://laws-lois.justice.gc.ca/eng/XML/SOR-2017-233.xml';

const lteListLink = 'https://www.publicsafety.gc.ca/cnt/_xml/lstd-ntts-eng.xml';


const cleanUpLTEList = (list)=> {
    return list.map ((element)=>{return {"name":element.title, "date":element.published, "link": lteListLink }} )
}
//GET LTE List XML
axios({
    method: 'get',
    url: lteListLink
    })
    .then(function (response) {
        let initialList = JSON.parse ( xmlParser.toJson (  response.data ) ).feed.entry;
        lteListData = cleanUpLTEList (initialList) //returns cleaned-up version of LTE List 

    });

let regulationFilteredData = [];

const regulationListLink = "https://laws-lois.justice.gc.ca/eng/XML/SOR-2002-284.xml"
//GET Regulation List 
axios({
    method: 'get',
    url: regulationListLink
    })
    .then(function (response) {
        
        let fetchData =  JSON.parse (xmlParser.toJson (response.data)) 
        //console.log(response);
        let filteredList = fetchData['Regulation']['Body']['Section'][0]['List']['Item'];

        for(let i=0;i<filteredList.length;i++){
            let temp = filteredList[i]['Text'];
            let text = temp.toString();
            let group_name = text.split(' (also')[0];
            let description = text.split(' (also')[1];
            regulationFilteredData[i]={"name":group_name,"description":'(also ' + description,"date":filteredList[0]['lims:inforce-start-date']};
        }
    });

axios({
    method: 'get',
    url: 'https://scsanctions.un.org/resources/xml/en/consolidated.xml'
    })
    .then(function (response) {
        data = response.data;
    
        var result = JSON.parse(xmlParser.toJson(data));

        var filteredList = result.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL;
        //console.log(filteredList);

        for(i=0; i<filteredList.length;i++){
            var name = filteredList[i].FIRST_NAME + " " + filteredList[i].SECOND_NAME + " " + filteredList[i].THIRD_NAME;
            var document = filteredList[i].INDIVIDUAL_DOCUMENT.TYPE_OF_DOCUMENT + " :" + filteredList[i].INDIVIDUAL_DOCUMENT.NUMBER;
            var dob = filteredList[i].INDIVIDUAL_DATE_OF_BIRTH.DATE;
            var address = filteredList[i].INDIVIDUAL_ADDRESS.COUNTRY;
            finalList[i] = {
                "name": name, 
                "documentType":document, 
                "dateOfBirth": dob,
                "countryAddress":address,
                "source": "https://scsanctions.un.org/resources/xml/en/consolidated.xml",
            };
        }
});

axios({
    method: 'get',
    url: listLink,
        })
        .then(function (response) {

            data = response.data;
        
        var xmlParser = require('xml2json');
        var result = JSON.parse(xmlParser.toJson(data));
        //var result = xmlParser.xml2json(data, {compact: false, spaces: 4});

        //  console.log(result);

            var filteredList = result.Regulation.Schedule[0].List.Item;

            for (i=0; i<filteredList.length; i++){

                var s = filteredList[i].Text;
                s = s.split(' (')[0];

                filteredData[i] = {"name":s, "date":filteredList[i]['lims:inforce-start-date'], "link": listLink };
            }
        });

app.get("/", (req, res) => {
    if (!res.headersSent) res.status(200).send({ 
        jSON_list: [...filteredData, ...finalList, ...regulationFilteredData, ...lteListData, ...masterListJSON.JSON_list]
    })
})

app.get("/addPersonEntity", (req, res) => {
    newPersonEntity = new PersonEntity({
        name: "John Cena",
        date: "2021/02/02",
        link: "www.bing.com",
        address: {
            streetNum: "13",
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
        ],
        agents: [
            {
                fullName: "AMAL  WARSAME",
                agentLocation: [
                    {
                        MainLocationIndicator: "1",
                        StreetAddress: "407-357 HOSSMAN ST",
                        CityName: "KITCHENER",
                        AlphaProvinceCode: "ON",
                        PostalZipCode: "N2M3N5",
                        AlphaCountryCode: "CA"
                    }
                ],
                agentBusinessActivity: [
                    {
                        ActivityDescriptionEnglish: "Foreign exchange dealing",
                        ActivityDescriptionFrench: "Opérations de change"
                    },
                    {
                        ActivityDescriptionEnglish: "Money transferring",
                        ActivityDescriptionFrench: "Transfert de fonds"
                    }
                ],
                agentPhone: "5195701082"
            }
        ]
    });

    MSB_Entity.insertMany(newMSB_Entity, () => {
        console.log("Added MSB Entity!");
        res.send("Added MSB Entity!");
    });
})

app.get("/deletePersonEntity", (req, res) => {
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