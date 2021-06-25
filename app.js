var express = require("express");
var app = express();
var axios = require('axios');

var xmlParser = require('xml2json');

var data = "";

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

app.get("/lteList", (_, res) => {
    if (!res.headersSent) res.status(200).send({ 
        jSON_list: [...lteListData, ...filteredData]
    })
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});