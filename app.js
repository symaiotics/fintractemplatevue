var express = require("express");
var app = express();
var axios = require('axios');
var xmlParser = require('xml2json');
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/API_test', { useNewUrlParser: true, useUnifiedTopology: true }); 

var data = "";

var masterListJSON = {
    JSON_list: []
};

var entitySchema = new mongoose.Schema({
    name: String,
    date: String,
    source: String
});

var Entity = mongoose.model("Entity", entitySchema);

var newEntity = new Entity({
    name: "John Smith",
    date: "2021/01/01",
    source: "www.google.ca"});

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
        jSON_list: [masterListJSON.JSON_list]
    })
})

app.get("/add", (req, res) => {
    Entity.insertMany(newEntity, () => {
        console.log("Added!");
        res.send("Added!");
    });

})

app.get("/delete", (req, res) => {
    Entity.deleteOne({name: "John Smith"}, () => {
        console.log("Deleted!");
        res.send("Deleted!");
    });
})


//To start server
app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});