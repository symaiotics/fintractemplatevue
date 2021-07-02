var mongoose = require('mongoose');

var MSBSchema = new mongoose.Schema({
    registrationNumber: String,
    businessName: String,
    registrationStatus: {
        StatusDescriptionEnglish: String,
        StatusDescriptionFrench: String
    },
    registrationDate: String,
    expirationDate: String,
    MsbOperateName: String,
    phone: String,
    webSiteAddress: String,
    businessIncorporation: {
        IncorporationNumber: String,
        IncorporationDate: String,
        IncorporationJurisdictionDescriptionEnglish: String,
        IncorporationJurisdictionDescriptionFrench: String
    },
    businessActivity: [
        {
            ActivityDescriptionEnglish: String,
            ActivityDescriptionFrench: String
        },
        {
            ActivityDescriptionEnglish: String,
            ActivityDescriptionFrench: String
        }
    ],
    location: [
        {
            MainLocationIndicator: String,
            StreetAddress: String,
            CityName: String,
            AlphaProvinceCode: String,
            PostalZipCode: String,
            AlphaCountryCode: String
        }
    ]
});

module.exports = {
    MSBSchema 
};