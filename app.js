var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml-js');

var data = "";

var masterListJSON = {
    JSON_list: []
};

axios({
    method: 'get',
    url: 'https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml'
    })
    .then(function (response) {
        data = xmlParser.xml2js(response.data, {compact: true});
    });

app.get("/", (req, res) => {

    for (var i = 0; i < data["data-set"].record.length; i++) {

        var entity = {};

        if (data["data-set"].record[i].Entity == null) {
            // Given Name
            entity["name"] = data["data-set"].record[i].GivenName ? data["data-set"].record[i].GivenName._text : null;
            // Last Name
            entity["name"] = entity.name + " " + (data["data-set"].record[i].LastName ? data["data-set"].record[i].LastName._text : null);
        } else {
            // Entity Name
            entity["name"] = data["data-set"].record[i].Entity._text;
        }

        entity["date"] = data["data-set"].record[i].DateOfBirth ? data["data-set"].record[i].DateOfBirth._text : null;
        entity["source"] = "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng";

        masterListJSON.JSON_list.push(entity);
    }

    if (!res.headersSent) res.status(200).send({ 
        masterListJSON
    }) 
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});