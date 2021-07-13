let readFromFile = require ("./MSBRegistry").readFromFile
var express = require("express");
var app = express();
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/API_test', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
var personSchema = require("./schemas/personEntity.js").personEntity;

// DB Models
var PersonEntity = mongoose.model("PersonEntity", personSchema);

// Dummy data to be add/remove from db (TESTING)
var newPersonEntity;

var consolidatedList = [];

const addToList = async () => {
	var ccas_request = await require("./api/ccas").sendGetRequest;
	var reg_request = await require("./api/regList").sendGetRequest;
	var jfv_request = await require("./api/jfv").sendGetRequest;
	var lte_request = await require("./api/lte").sendGetRequest;
  	var unlist_request = await require("./api/unlist").sendGetRequest;

	consolidatedList = [...ccas_request, ...reg_request, ...jfv_request, ...lte_request, ...unlist_request]
}

addToList()

app.get("/", async (req, res) => {
	if (!res.headersSent) res.status(200).send({jSON_list: consolidatedList});
});

app.get("/addPersonEntity", (req, res) => {
	PersonEntity.insertMany(consolidatedList, (err) => {
		if (err) {
			console.log("Failed to add Person Entity.");
			res.send("Failed to add Person Entity.");
		} else {
			console.log("Added Person Entity!");
			res.send("Added Person Entity!");
		}
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