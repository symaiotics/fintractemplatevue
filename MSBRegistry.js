var parser = require("xml2json");
fs = require("fs").promises;

//TEST CASES
//M08431798 no agent
//M12939110 one agent
//M08669363 multi agent
//M19545768 multi MsbBusinessActivity & multi locations
//M08434209 multi agents && multi agent locations at agent number 7(BCU Financial)

//https://open.canada.ca/data/en/dataset/8beacccf-3b54-4d12-9cf7-24e2ada90a83

/***
 * extractName function
 * Takes in msbObj(current MSB JSON object), MsbLegalBusinessName path, MsbLegalIndividualName path
 * Depends on name type, return the full name
 ***/
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
      fullName: `${individualName.GivenName} ${
        individualName.MiddleName ? individualName.MiddleName : ""
      } ${individualName.Surname}`,
    };
  }
};

/***
 * extractLocation function
 * Takes in msbObj(current MSB JSON object)
 * return the array or the single location information
 * or return undfined if no location information found
 ***/
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

/***
 * extractAgentLocation function (same thing as extractLocation function)
 * Takes in agentObj(current MSB JSON object)
 * return the array or the single location information from agent tag
 * or return undfined if no agent location information found
 * Note: sequence number is removed
 ***/
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

/***
 * extractAgents function
 * Takes in agentObj(current MSB JSON object)
 * return the array or the single agent from agent tag
 * or return undefined if no agent information found
 * Note: sequence number is removed
 * calls extractName and extractAgentLocation for extracting those information
 * rest of the info is extracted by the json link
 * returns full name, location, BusinessActivity, phone number
 ***/
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
          agentPhone: agent.AgentPhone.PhoneNumber,
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
          agentPhone: agentInfo.AgentPhone.PhoneNumber,
        },
      ];
    }
  } else return undefined;
};

/**
 * 
 * @param {*} data 
 * @param {String} dest 
 * writeFile function
 * prints the result testMSB JSON into "./assets/MSBRegistry.json"
 */
const writeToFile = (data, dest = "./assets/MSBRegistry.json") => {
  console.log(`Writing MSBRegistry->JSON to...\n${dest}`);
  fs.writeFile(dest, data, function (err, result) {
    if (err) console.log("error", err);
  });
};


/**
 * 
 * @param {Boolean} writeFlag 
 * @param {String} filePath 
 * @returns [{JSONified  and cleaned MSBRegistry list}]
 * reads MsbRegistryPublicDataFile.xml into JSON, intiates some clean-up and returns JSONified MSBRegistry List
 */
const readFromFile = async (
  writeFlag = false,
  filePath = "./assets/MsbRegistryPublicDataFile.xml"
) => {
  let data = await fs.readFile(filePath);
  let msbJSON = JSON.parse(parser.toJson(data));
  let finalMSBJSON = msbJSON["MsbRegistryXmlFile"]["MsbInformation"].map(
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
  );
  if (writeFlag) {
    writeToFile(JSON.stringify(finalMSBJSON));
  }
  return finalMSBJSON;
};


exports.readFromFile = readFromFile
