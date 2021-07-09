var axios = require('axios');
var faker = require('faker');
var xmlParser = require('xml2json');

const listLink = "https://laws-lois.justice.gc.ca/eng/XML/SOR-2017-233.xml";

var filteredData = [];

    
const insertDataIntoMasterList = (data) => {
	
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
}

const sendGetRequest = async () => {
    try {
        const response = await axios.get(listLink);
        var data = JSON.parse(xmlParser.toJson(response.data));
		insertDataIntoMasterList(data);
		return filteredData
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};


module.exports = {
    sendGetRequest: sendGetRequest() 
};