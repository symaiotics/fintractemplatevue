let readFromFile = require ("./MSBRegistry").readFromFile
var express = require("express");
var app = express();

var axios = require('axios');
var xmlParser = require('xml2json');
var mongoose = require("mongoose");
var faker = require('faker');

faker.locale = "en_CA";

mongoose.connect('mongodb://localhost:27017/API_test', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
var msbSchema = require("./schemas/MSBEntity.js").msbSchema;
var personSchema = require("./schemas/personEntity.js").personEntity;

// DB Models
var MSB_Entity = mongoose.model("MSB_Entity", msbSchema);
var PersonEntity = mongoose.model("PersonEntity", personSchema);

// Dummy data to be add/remove from db (TESTING)
var newMSB_Entity;
var newPersonEntity;

var consolidatedList = [];

const addToList = async () => {
	var ccas_request = await require("./api/ccas").sendGetRequest;
	var reg_request = await require("./api/regList").sendGetRequest;
	var jfv_request = await require("./api/jfv").sendGetRequest;
	var lte_request = await require("./api/lte").sendGetRequest;
  	var unlist_request = await require("./api/unlist").sendGetRequest;

	consolidatedList = [...ccas_request, ...reg_request, ...jfv_request, ...lte_request, unlist_request]
}

app.get("/", async (req, res) => {
	await addToList()
	if (!res.headersSent) res.status(200).send({jSON_list: consolidatedList});
});

app.get("/addPersonEntity", (req, res) => {
	newPersonEntity = new PersonEntity(consolidatedList[0]);

	PersonEntity.insertMany(newPersonEntity, (err) => {
		if (err) {
			console.log("Failed to add Person Entity.");
			res.send(newPersonEntity);
		} else {
			console.log("Added Person Entity!");
			res.send("Added Person Entity!");
		}
	});
});

app.get("/deletePersonEntity", (req, res) => {
	PersonEntity.deleteOne({ name: "John Cena" }, () => {
		console.log("Deleted Person Entity!");
		res.send("Deleted Person Entity!");
	});
});

app.get ("/msb", async (req, res)=> {
    let limit =  req.query.limit;
    let msbData = await readFromFile ()
    limit = limit || msbData.length //if limit is provided then limit is initiated else its the length of the MSBRegistry

    if (!res.headersSent) res.status(200).send({ 
        msb_data: msbData.slice (0,parseInt (limit))
    })

});

//To start server
app.listen(3000, process.env.IP, function () {
	console.log("Server has started.");
});