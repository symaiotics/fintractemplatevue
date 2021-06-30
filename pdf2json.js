var express = require("express");
const PDFParser = require("pdf2json");
let fs = require("fs")




let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

pdfParser.on("pdfParser_dataReady", pdfData => {
    console.log (pdfData)
    fs.writeFile( "F1040EZ.fields.json", JSON.stringify(pdfData), (err, result)=>{if (err) console.log ("error", err) } );
});

pdfParser.loadPDF('./bank_list.pdf')