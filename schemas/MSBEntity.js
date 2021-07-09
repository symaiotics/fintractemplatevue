var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    mainLocationIndicator: {type: Boolean, required: true},
    streetAddress: {type: String, required: true},
    cityName: {type: String, required: true},
    alphaProvinceCode: {type: String, required: true},
    postalZipCode: {type: String, required: true},
    alphaCountryCode: {type: String, required: true}
})

var msbSchema = new mongoose.Schema({
    registrationNumber: {type: Number, required: true},
    businessName: {type: String, required: true},
    registrationStatus: {
        en: {type: String, required: true},
        fr: {type: String, required: true}
    },
    registrationDate: {type: Date, required: true},
    expirationDate: {type: Date, required: true},
    msbOperateName: {type: String, required: true},
    phone: {type: String, required: true},
    webSiteAddress: {type: String, required: false},
    businessIncorporation: {
        number: {type: Number, required: true},
        date: {type: Date, required: true},
        jurisdictionDescription: {
            en: {type: String, required: true},
            fr: {type: String, required: true}
        }
    },
    businessActivity: [
        {
            en: {type: String, required: true},
            fr: {type: String, required: true}
        }
    ],
    location: [locationSchema],
    agents: [
        {
            fullName: {type: String, required: true},
            agentLocation: [locationSchema],
            agentBusinessActivity: [
                {
                    en: {type: String, required: true},
                    fr: {type: String, required: true}
                }
            ],
            agentPhone: {type: String, required: true}
        }
    ]
});

module.exports = {
    msbSchema, locationSchema 
};