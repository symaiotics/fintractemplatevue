var axios = require('axios');
var faker = require('faker');
var xmlParser = require('xml2json');

var masterListJSON = {
	jsonList: [],
};

var finalList = [];


const insertDataIntoMasterList = (data = response.data) => {


	var result = JSON.parse(xmlParser.toJson(data));

	var filteredList = result.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL;
	//console.log(filteredList);
	for (i = 0; i < filteredList.length; i++) {
		var name = filteredList[i].FIRST_NAME +
			" " +
			filteredList[i].SECOND_NAME +
			" " +
			filteredList[i].THIRD_NAME;
		var document = filteredList[i].INDIVIDUAL_DOCUMENT.TYPE_OF_DOCUMENT +
			" :" +
			filteredList[i].INDIVIDUAL_DOCUMENT.NUMBER;
		var dob = filteredList[i].INDIVIDUAL_DATE_OF_BIRTH.DATE;
		var address = filteredList[i].INDIVIDUAL_ADDRESS.COUNTRY;
		finalList[i] = {
			name: name,
			date: dob,
			link: "https://scsanctions.un.org/resources/xml/en/consolidated.xml",
			address: {
				streetNum: faker.datatype.number(),
				street: faker.address.streetName(),
				city: faker.address.cityName(),
				prov: faker.address.state(),
				postal: faker.address.zipCodeByState(),
			},
			person_id: {
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

        masterListJSON.jsonList.push(finalList);

    }
};
axios({
    method: "get",
    url: "https://scsanctions.un.org/resources/xml/en/consolidated.xml",
    }).then((response) => {
        var data = JSON.parse(xmlParser.toJson(response.data));
        insertDataIntoMasterList(data);
});

module.exports = {
    finalList 
};