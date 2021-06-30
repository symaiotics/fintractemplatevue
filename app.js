var express = require("express");
var app = express();
var axios = require("axios");
var xmlParser = require("xml2json");
var faker = require("faker");
faker.locale = "en_CA";

var data = "";
var finalList = [];

var masterListJSON = {
  JSON_list: [],
};

const insertDataIntoMasterList = (data) => {
  for (elem of data["data-set"].record) {
    var entity = {
      name: elem.Entity ? elem.Entity : elem.GivenName + " " + elem.LastName,
      date: elem.DateOfBirth,
      link: "https://www.international.gc.ca/world-monde/international_relations-relations_internationales/sanctions/consolidated-consolide.aspx?lang=eng",
      address: {
        streetNum: faker.datatype.number(),
        street: faker.address.streetName(),
        city: faker.address.cityName(),
        prov: faker.address.state(),
        postal: faker.address.zipCodeByState(),
      },
    };

    masterListJSON.JSON_list.push(entity);
  }
};

axios({
  method: "get",
  url: "https://www.international.gc.ca/world-monde/assets/office_docs/international_relations-relations_internationales/sanctions/sema-lmes.xml",
}).then(function (response) {
  data = JSON.parse(xmlParser.toJson(response.data));
  insertDataIntoMasterList(data);
});

let lteListData = [];
let filteredData = [];

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
});

let regulationFilteredData = [];

const regulationListLink =
  "https://laws-lois.justice.gc.ca/eng/XML/SOR-2002-284.xml";
//GET Regulation List
axios({
  method: "get",
  url: regulationListLink,
}).then(function (response) {
  let fetchData = JSON.parse(xmlParser.toJson(response.data));
  //console.log(response);
  let filteredList =
    fetchData["Regulation"]["Body"]["Section"][0]["List"]["Item"];

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
    };
  }
});

axios({
  method: "get",
  url: "https://scsanctions.un.org/resources/xml/en/consolidated.xml",
}).then(function (response) {
  data = response.data;

  var result = JSON.parse(xmlParser.toJson(data));

  var filteredList = result.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL;
  //console.log(filteredList);

  for (i = 0; i < filteredList.length; i++) {
    var name =
      filteredList[i].FIRST_NAME +
      " " +
      filteredList[i].SECOND_NAME +
      " " +
      filteredList[i].THIRD_NAME;
    var document =
      filteredList[i].INDIVIDUAL_DOCUMENT.TYPE_OF_DOCUMENT +
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
    };
  }
});

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
    };
  }
});

app.get("/", (req, res) => {
  if (!res.headersSent)
    res.status(200).send({
      jSON_list: [
        ...filteredData,
        ...finalList,
        ...regulationFilteredData,
        ...lteListData,
        ...masterListJSON.JSON_list,
      ],
    });
});
//To start server
app.listen(3000, process.env.IP, function () {
  console.log("Server has started.");
});



