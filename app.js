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

var ccas_list = require("./api/ccas").masterListJSON;

consolidatedList = [...ccas_list.jsonList];

let lteListData = [];

const listLink = "https://laws-lois.justice.gc.ca/eng/XML/SOR-2017-233.xml";

const lteListLink = "https://www.publicsafety.gc.ca/cnt/_xml/lstd-ntts-eng.xml";

const cleanUpLTEList = (list) => {
	return list.map((element) => {
		return {
			name: element.title,
			date: element.published,
			link: lteListLink,
			address: {
				streetNum: faker.datatype.number(),
				street: faker.address.streetName(),
				city: faker.address.cityName(),
				prov: faker.address.state(),
				postal: faker.address.zipCodeByState(),
			},
			id: {
				idType: "Driver's License",
				idNumber: faker.finance.routingNumber(),
				idJuristiction: faker.address.state(),
			},
			accountInfo: {
				locale: "Domestic",
				institution: "TD",
				transitNum: faker.finance.routingNumber(),
				accountNum: faker.finance.account(),
				status: "Active",
			},
			dateRange: "2020-2021"
		};
	});
};

//GET LTE List XML
axios({
	method: "get",
	url: lteListLink,
}).then(function (response) {
	let initialList = JSON.parse(xmlParser.toJson(response.data)).feed.entry;
	lteListData = cleanUpLTEList(initialList); //returns cleaned-up version of LTE List
	consolidatedList = [...lteListData];
});

let regulationFilteredData = [];

const regulationListLink = "https://laws-lois.justice.gc.ca/eng/XML/SOR-2002-284.xml";

//GET Regulation List
axios({
	method: "get",
	url: regulationListLink,
}).then(function (response) {
	let fetchData = JSON.parse(xmlParser.toJson(response.data));
	//console.log(response);
	let filteredList = fetchData["Regulation"]["Body"]["Section"][0]["List"]["Item"];

	for (let i = 0; i < filteredList.length; i++) {
		let temp = filteredList[i]["Text"];
		let text = temp.toString();
		let group_name = text.split(" (also")[0];
		let description = text.split(" (also")[1];
		regulationFilteredData[i] = {
			name: group_name,
			date: filteredList[0]["lims:inforce-start-date"],
			link: regulationListLink,
			address: {
				streetNum: faker.datatype.number(),
				street: faker.address.streetName(),
				city: faker.address.cityName(),
				prov: faker.address.state(),
				postal: faker.address.zipCodeByState(),
			},
			id: {
				idType: "Driver's License",
				idNumber: faker.finance.routingNumber(),
				idJuristiction: faker.address.state(),
			},
			accountInfo: {
				locale: "Domestic",
				institution: "TD",
				transitNum: faker.finance.routingNumber(),
				accountNum: faker.finance.account(),
				status: "Active",
			},
			dateRange: "2020-2021"
		};
	}
	consolidatedList = [...regulationFilteredData];
});

var finalList = [];



var unlist = require("./api/unlist").masterListJSON;

consolidatedList = [...unlist.jsonList];

var filteredData = [];

axios({
	method: "get",
	url: listLink,
}).then(function (response) {
	data = response.data;

	var xmlParser = require("xml2json");
	var result = JSON.parse(xmlParser.toJson(data));
	//var result = xmlParser.xml2json(data, {compact: false, spaces: 4});
	// console.log(result);
	var filteredList = result.Regulation.Schedule[0].List.Item;

	for (i = 0; i < filteredList.length; i++) {
		var s = filteredList[i].Text;
		s = s.split(" (")[0];

		filteredData[i] = {
			name: s,
			date: filteredList[i]["lims:inforce-start-date"],
			link: listLink,
			address: {
				streetNum: faker.datatype.number(),
				street: faker.address.streetName(),
				city: faker.address.cityName(),
				prov: faker.address.state(),
				postal: faker.address.zipCodeByState(),
			},
			id: {
				idType: "Driver's License",
				idNumber: faker.finance.routingNumber(),
				idJuristiction: faker.address.state(),
			},
			accountInfo: {
				locale: "Domestic",
				institution: "TD",
				transitNum: faker.finance.routingNumber(),
				accountNum: faker.finance.account(),
				status: "Active",
			},
			dateRange: "2020-2021"
		};
	}
	consolidatedList = [...filteredData];
});

app.get("/", (req, res) => {
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

}  )


app.get ("/msb", async (req, res)=> {
    let limit =  req.query.limit;
    let msbData = await readFromFile ()
    limit = limit || msbData.length //if limit is provided then limit is initiated else its the length of the MSBRegistry

    if (!res.headersSent) res.status(200).send({ 
        msb_data: msbData.slice (0,parseInt (limit))
    })

}  )


//To start server
app.listen(3000, process.env.IP, function () {
	console.log("Server has started.");
});