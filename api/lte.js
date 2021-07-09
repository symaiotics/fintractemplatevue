var axios = require('axios');
var faker = require('faker');
var xmlParser = require('xml2json');

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

async function getLteList () {
    try {
        let response = await axios({
            method: "get",
            url: lteListLink,
        })
        let initialList = JSON.parse(xmlParser.toJson(response.data)).feed.entry;
        return cleanUpLTEList(initialList); //returns cleaned-up version of LTE List


    }catch (err) {
        console.err (err)
    }
}

module.exports= {
    sendGetRequest: getLteList()
}



