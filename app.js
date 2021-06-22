var express = require("express");
var app = express();
var axios = require('axios');

var data = "";

axios({
    method: 'get',
    url: 'https://www.google.ca'
    })
    .then(function (response) {
        console.log(response);
        data = response;
    });

app.get("/", (req, res) => {
    if (!res.headersSent) res.status(200).send({ 
        jSON_list: data
    })
})

app.listen(3000, process.env.IP, function () {
    console.log("Server has started.");
});