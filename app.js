var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');

var data = "";

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

app.get("/", (req, res) => {
    if (!res.headersSent) res.status(200).send({ 
        masterListJSON
    }) 
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});