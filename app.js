var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml-js');

var data = "";

var masterListJSON = {
    JSON_list: []
};

const insertDataIntoMasterList = (data) => {
    for (elem of data["data-set"].record) {
        var entity = {};

        if (elem.Entity == null) {
            // Given Name
            entity["name"] = elem.GivenName ? elem.GivenName._text : null;
            // Last Name
            entity["name"] = entity.name + " " + (elem.LastName ? elem.LastName._text : null);
        } else {
            // Entity Name
            entity["name"] = elem.Entity._text;
        }

        entity["date"] = elem.DateOfBirth ? elem.DateOfBirth._text : null;
        entity["source"] = "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng";

        masterListJSON.JSON_list.push(entity);
    }
}

axios({
    method: 'get',
    url: 'https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml'
    })
    .then(function (response) {
        data = xmlParser.xml2js(response.data, {compact: true});
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