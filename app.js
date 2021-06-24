var express = require("express");
var app = express();
var axios = require('axios');
//const xmlParser = require('xml-js');

var data = "";

let filteredData = [];

const listLink = 'https://laws-lois.justice.gc.ca/eng/XML/SOR-2017-233.xml';


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
        jSON_list: filteredData
    })
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});