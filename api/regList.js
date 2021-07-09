var axios = require('axios');
var faker = require('faker');
var xmlParser = require('xml2json');

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

});

module.exports = {
    regulationListLink
};