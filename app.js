var express = require("express");
var app = express();
var axios = require('axios');
let xmlParser = require('xml2json');

var data = "";

let filteredData = [];

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
        filteredData[i]={"name":group_name,"description":'(also ' + description,"date":filteredList[0]['lims:inforce-start-date']};
        }
    });

app.get("/regulationList", (req, res) => {
    if (!res.headersSent) res.status(200).send({ 
        jSON_list: data
    })
})

//To start server
app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});