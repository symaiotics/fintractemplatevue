var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');

var data = "";
var finalList=[];

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
        jSON_list: [...filteredData, ...finalList, ...regulationFilteredData, ...lteListData]
    })
})

//To start server
app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});