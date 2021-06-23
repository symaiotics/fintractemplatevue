var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');

var data = "";

let lteListData= []


const lteListLink = 'https://www.publicsafety.gc.ca/cnt/_xml/lstd-ntts-eng.xml'

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

app.get("/lteList", (_, res) => {
    if (!res.headersSent) res.status(200).send({ 
        jSON_list: lteListData
    })
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});