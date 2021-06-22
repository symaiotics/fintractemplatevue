var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');

var data = "";

var masterListJSON = {
    jSON_list: []
};

axios({
    method: 'get',
    url: 'https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml'
    })
    .then(function (response) {
        data = JSON.parse(xmlParser.toJson(response.data))
    });

app.get("/", (req, res) => {

    for (var i = 0; i < data["data-set"].record.length; i++) {

        if (data["data-set"].record[i].Entity == null) {
            masterListJSON.jSON_list.push({
                name: data["data-set"].record[i].GivenName + " " + data["data-set"].record[i].LastName,
                date: data["data-set"].record[i].DateOfBirth,
                source: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng"
            })
        } else {
            masterListJSON.jSON_list.push({
                name: data["data-set"].record[i].Entity,
                date: data["data-set"].record[i].DateOfBirth,
                source: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng"
            })
        }
    }

    if (!res.headersSent) res.status(200).send({ 
        masterListJSON
        // data
    }) 
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});