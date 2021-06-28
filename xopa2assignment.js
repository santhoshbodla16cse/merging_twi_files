var express = require('express');
// var router = express.Router();
var f = require('fs');
var parse = require('csv-parse');
// var async = require('async');
var csv = require("fast-csv");
var _ = require('lodash');

const file1 = 'file1.csv'
const file2 = 'file2.csv'
// const stream = f.createReadStream(file1);
// const stream2 = f.createReadStream(file2);
const fileData1 = [];
const fileData2 = [];


const file1Promise = new Promise((resolve) => {
    csv
        .parseFile(file1, {headers: true})
        .on('data', function(data) {
          fileData1.push(data);
        })
        .on('end', function() {
          console.log('done');
          resolve();
        });
       
  });
 
  const file2Promise = new Promise((resolve) => {
    csv
        .parseFile(file2, {headers: true})
        .on('data', function(data) {
          fileData2.push(data);
        })
        .on('end', function() {
          console.log('done');
          resolve();
        });
  });
 
  Promise.all([
    file1Promise,
    file2Promise,
  ])
      .then(() => {
        // var fd1=[];
        //Used Lodash for converting headers in second file to allign with file1(by making to lwercase)
        var fd2 =[];
        for(var i =0;i<fileData2.length;i++){
        var lowerObj = _.transform(fileData2[i], function (result, val, key) {
          result[key.toLowerCase()] = val;
      });
      fd2.push(lowerObj);

    }
    // console.log(fd2);
        var res =[];

        for(var i=0;i<fileData1.length;i++){
            var trash = fileData1[i].email.toLowerCase();
            res[trash] = fileData1[i]
            
        }
       
        
        var fin = new Set();
        for(var j=0;j<fd2.length;j++){
          // console.log(fd2[j].email);
          // console.log(fd2[j].email.toLowerCase());
          // console.log(fd2[j].email=="")
            if(fd2[j].email.toLowerCase() in res){
                var mid = Object.assign(res[fd2[j].email.toLowerCase()],fd2[j])
                 fin.add(mid)
            }
        }
      
          // console.log(fin)        
  
        const csvStream = csv.format({headers: true});
        
        const writableStream = f.createWriteStream('outputfile.csv');

        writableStream.on('finish', function() {
          console.log('DONE!');
        });
  
        csvStream.pipe(writableStream);
        fin.forEach((data) => {
          csvStream.write(data);
        });
        csvStream.end();
      });
