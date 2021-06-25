var express = require("express");
var app = express();
var axios = require('axios');
var convert = require('xml2json');

var data = "";
var finalList=[];

let filteredData = [];

const listLink = 'https://laws-lois.justice.gc.ca/eng/XML/SOR-2017-233.xml';

axios({
    method: 'get',
    url: 'https://scsanctions.un.org/resources/xml/en/consolidated.xml'
    })
    .then(function (response) {
        data = response.data;
       
        var result = JSON.parse(convert.toJson(data));

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
        jSON_list: [...filteredData, ...finalList]
    })
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});