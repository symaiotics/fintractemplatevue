var parser = require('xml2json');
fs = require('fs');
//https://open.canada.ca/data/en/dataset/8beacccf-3b54-4d12-9cf7-24e2ada90a83

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map


fs.readFile('./assets/MsbRegistryPublicDataFile.xml', function (err, data) {
    let msbJSON = JSON.parse(parser.toJson(data));
    let testMSB = msbJSON = msbJSON['MsbRegistryXmlFile']['MsbInformation'].map(
        (elem) => {
            let finalElem = { registrationNumber: elem.MsbRegistrationNumber }
            if (elem.MsbLegalBusinessName) {
                if ( Array.isArray (elem.MsbLegalBusinessName)) {
                    finalElem.businessName = elem.MsbLegalBusinessName[1].Name
                }
                else {
                    finalElem.businessName = elem.MsbLegalBusinessName.Name
                }
            }
            else {
                finalElem.fullName = `${elem.MsbLegalIndividualName.Surname} ${elem.MsbLegalIndividualName.MiddleName? elem.MsbLegalIndividualName.MiddleName : "" } ${elem.MsbLegalIndividualName.GivenName}`
            }
            finalElem.registrationDate = elem.MsbRegistrationDate
            finalElem.expirationDate = elem.MsbRegistrationExpirationDate
            finalElem.cessationDate = elem.MsbCessationDate
            finalElem.MsbOperateName = elem.MsbOperateName
            finalElem.phone = elem.MsbPhone.PhoneNumber
            finalElem.webSiteAddress = elem.MsbWebSiteAddress
            finalElem.businessIncorporation = elem.MsbBusinessIncorporation
            finalElem.businessActivity = elem.MsbBusinessActivity
           // finalElem.location = !(Array.isArray (elem.MsbLocationInformation))? 


            return finalElem
        }

    )

    console.log(testMSB.forEach (elem=>console.log (elem)))
    fs.writeFile("./assets/whatisgoingon.json",JSON.stringify(testMSB), function(err, result) {
                if(err) console.log('error', err);
              });
    // let MSBList = msbJSON['MsbRegistryXmlFile']['MsbInformation']
    // for (let i = 0 ; i<MSBList.length; i++){
    //     if (MSBList[i].MsbLegalBusinessName){
    //         console.log (MSBList[i].MsbLegalBusinessName.Name)
    //     }
    //     else {
    //         MSBList[i].MsbLegalIndividualName.Surname

    //     }

    // }
});

