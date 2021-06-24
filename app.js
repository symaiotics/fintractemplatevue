var express = require("express");
var app = express();
var axios = require('axios');
var convert = require('xml2json');




var data = "";
var testing="";
var loopingvar =[];
var finalList=[];

axios({
    method: 'get',
    url: 'https://scsanctions.un.org/resources/xml/en/consolidated.xml'
    })
    .then(function (response) {
       // console.log(response.data);
        data = response.data;
       // console.log(convert.xml2js(data,{compact:true}));
        // testing = convert.xml2js(data,{compact:true});
        // loopingvar = testing["CONSOLIDATED_LIST"]["INDIVIDUALS"]["INDIVIDUAL"];
        // //console.log(loopingvar);
        // //loopingvar.forEach(element=>console.log(element));
        // for (element of loopingvar){
        //     console.log(element);
        //     if (element ==  "FIRST_NAME"){
        //         finalList+=testing["CONSOLIDATED_LIST"]["INDIVIDUALS"]["INDIVIDUAL"]["FIRST_NAME"]["_text"];
                
        //     }
        // }
        //console.log(finalList);
        var result = JSON.parse(convert.toJson(data));
        //console.log(result);

        var filteredList = result.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL;
        console.log(filteredList);

        for(i=0; i<filteredList.length;i++){
            var name = filteredList[i].FIRST_NAME + " " + filteredList[i].SECOND_NAME + " " + filteredList[i].THIRD_NAME;
            var document = filteredList[i].INDIVIDUAL_DOCUMENT.TYPE_OF_DOCUMENT + " :" + filteredList[i].INDIVIDUAL_DOCUMENT.NUMBER;
            var dob = filteredList[i].INDIVIDUAL_DATE_OF_BIRTH.DATE;
            finalList[i] = {
                "name": name, 
                "documentType":document, 
                "dateOfBirth": dob,
                "source": "https://scsanctions.un.org/resources/xml/en/consolidated.xml",
            };
        }

    });

app.get("/", (req, res) => {

    if (!res.headersSent) res.status(200).send({ 
        //jSON_list: data
        finalList
        
    })
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});