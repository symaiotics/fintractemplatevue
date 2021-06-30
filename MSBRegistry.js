var parser = require("xml2json");
fs = require("fs");

//TEST CASES
//M08431798 no agent
//M12939110 one agent
//M08669363 multi agent
//M19545768 multi MsbBusinessActivity & multi locations
//M08434209 multi agents && multi agent locations at agent number 7(BCU Financial)

//https://open.canada.ca/data/en/dataset/8beacccf-3b54-4d12-9cf7-24e2ada90a83

const extractName = (
  msbObj,
  businessNameProperty = "MsbLegalBusinessName",
  individualNameProperty = "MsbLegalIndividualName"
) => {
  let msbName = msbObj[businessNameProperty];
  if (msbName) {
    //handling situation when MsbLegalBusinessName is an Array[English Name, French Name ]
    //if the MsbLegalBusinessName is an array then extract the english name, otherwise return the name
    return Array.isArray(msbName)
      ? { businessName: msbName[1].Name }
      : { businessName: msbName.Name };
  } else {
    //Since it is not a Business, the Individual GivenName, MiddleName(if provided) and Surname are extracted
    let individualName = msbObj[individualNameProperty];
    return {
      fullName: `${individualName.GivenName} ${individualName.MiddleName ? individualName.MiddleName : ""} ${individualName.Surname}`,
    };
  }
};

const extractLocation = (msbObj) => {
  let locationInfo = msbObj.MsbLocationInformation;
  if (locationInfo) {
    if (Array.isArray(locationInfo)) {
      return locationInfo.map((location) => location.MsbLocation);
    } else {
      return [locationInfo.MsbLocation];
    }
  } else return undefined;
};

const extractAgentLocation = (agentObj) => {
  let locationInfo = agentObj.AgentLocation;
  if (locationInfo) {
    if (Array.isArray(locationInfo)) {
      return locationInfo.map((location) => {
        delete location.SequenceNumber;
        return location;
      });
    } else {
      delete locationInfo.SequenceNumber;
      return [locationInfo];
    }
  } else return undefined;
};


const extractAgents = (msbObj) => {
  let agentInfo = msbObj.MsbAgent;
  if (agentInfo) {
    if (Array.isArray(agentInfo)) {
      return agentInfo.map((agent) => {
        return {
          ...extractName(
            agent,
            "AgentLegalBusinessName",
            "AgentLegalIndividualName"
          ),
          agentLocation: extractAgentLocation(agent),
          agentBusinessActivity: agent.AgentBusinessActivity,
          agentPhone: agent.AgentPhone.PhoneNumber
        };
      });
    } else {
      return [
        {
          ...extractName(
            agentInfo,
            "AgentLegalBusinessName",
            "AgentLegalIndividualName"
          ),
          agentLocation: extractAgentLocation(agentInfo),
          agentBusinessActivity: agentInfo.AgentBusinessActivity,
          agentPhone:agentInfo.AgentPhone.PhoneNumber
        },
      ];
    }
  } else return undefined;
};


fs.readFile("./assets/MsbRegistryPublicDataFile.xml", function (err, data) {
  let msbJSON = JSON.parse(parser.toJson(data));
  let testMSB = (msbJSON = msbJSON["MsbRegistryXmlFile"]["MsbInformation"].map(
    (elem) => {
      return {
        registrationNumber: elem.MsbRegistrationNumber,
        ...extractName(elem),
        registrationStatus: elem.MsbRegistrationStatus,
        registrationDate: elem.MsbRegistrationDate,
        expirationDate: elem.MsbRegistrationExpirationDate,
        cessationDate: elem.MsbCessationDate,
        MsbOperateName: elem.MsbOperateName,
        phone: elem.MsbPhone.PhoneNumber,
        webSiteAddress: elem.MsbWebSiteAddress,
        businessIncorporation: elem.MsbBusinessIncorporation,
        businessActivity: Array.isArray(elem.MsbBusinessActivity)
          ? elem.MsbBusinessActivity
          : [elem.MsbBusinessActivity],
        location: extractLocation(elem),
        agents: extractAgents(elem),
      };
      
    }
  ));

  //REMOVE COMMENT IF YOU ALSO WANT TO LOG THE LIST TO TERMINAL/CONSOLE
  //console.log(testMSB.forEach((elem) => console.log(elem)));
  
  fs.writeFile(
    "./assets/MSBRegistry.json",
    JSON.stringify(testMSB),
    function (err, result) {
      if (err) console.log("error", err);
    }
  );
  
});
