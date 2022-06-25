const express = require("express");
const path = require("path");
const app = express();
const rec_engine = require("../Json files/rest_recommend");
const connection = require('./db/conn');
var bodyParser = require('body-parser');

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setting the view engine to pug.
app.set("view engine","pug");

// Function to start the server.
app.listen(3000, () =>{
    console.log(`Server is running at port 3000`);
    connection.connect(function(err){
        if (err) throw err;
        console.log('Connected to database');
    });
})

// Function to handle the request for getting data from the database.
function get_row(query){
    return new Promise((resolve,reject)=>{
        connection.query(query,(err,rows,fields)=>{
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

//  Function to handle the request for getting ranking wise data for displaying sorted on the basis of score calculated 
app.get('/',async function(req,res){
    let query = "SELECT * FROM `ranking` order by score desc";
    const ranks = await get_row(query);
    query = "SELECT * from lcfa where category LIKE '%cafe%' order by dining_rating desc";
    const cafe = await get_row(query);
    query = "SELECT * from lcfa where known_for22 LIKE '%restaurant%' order by dining_rating desc";
    const rest = await get_row(query);
    query = "SELECT * from lcfa WHERE known_for22 LIKE '%romantic%' order by dining_rating desc";
    const rom = await get_row(query);
    query = "SELECT * from lcfa WHERE known_for22 LIKE '%family%' order by dining_rating desc";
    const fam = await get_row(query);
    res.render("index", { ranks: ranks, cafe: cafe, rest: rest, rom: rom, fam: fam });      
});



