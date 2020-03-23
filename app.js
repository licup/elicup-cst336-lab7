const express = require("express");
const app = express();
app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');

//routes
app.get("/", async function(req, res){
    
 let parsedData = await getImages("otters");
 
 console.dir("parsedData: " + parsedData); //displays content of the object
    
 res.render("index.html", {"image":parsedData.hits[0].largeImageURL});
            
}); //root route


app.get("/results", async function(req, res){
    
    //console.dir(req);
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method
    let orient = req.query.orient;
    let parsedData = await getImages(keyword, orient);
    var img = Random(parsedData);
    res.render("results.html", {"images":parsedData, "img":img});
    
});//results route


//Returns all data from the Pixabay API as JSON format
function getImages(keyword, orient){
    
    
    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword + "&orientation="+orient,
                 function (error, response, body) {
    
            if (!error && response.statusCode == 200  ) { //no issues in the request
                
                let parsedData = JSON.parse(body); //converts string to JSON
                resolve(parsedData);
                console.log(parsedData.hits[0].likes);
                
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
    
          });//request
   
    });
    
}

function Random(res){
    var arr=[];
    while (arr.length!=4){
        let randomIndex = Math.floor(Math.random() * res.hits.length);
        if(arr.indexOf(randomIndex)==-1){
            arr.push(randomIndex);
        }
    }
    return arr;
}

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});