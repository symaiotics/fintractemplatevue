var axios = require('axios');
var faker = require('faker');
var xmlParser = require('xml2json');

faker.locale = "en_CA";

var masterListJSON = {
	jsonList: [],
};

const insertDataIntoMasterList = (data) => {
	for (elem of data["data-set"].record) {
		var entity = {
			name: elem.Entity ? elem.Entity : elem.GivenName + " " + elem.LastName,
			date: elem.DateOfBirth || faker.date.past(),
			link: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng",
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

		masterListJSON.jsonList.push(entity);
	}
};

const sendGetRequest = async () => {
    try {
        const response = await axios.get('https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml');
        var data = JSON.parse(xmlParser.toJson(response.data));
		insertDataIntoMasterList(data);
		return masterListJSON.jsonList
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

module.exports = {
    sendGetRequest: sendGetRequest()
};