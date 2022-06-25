// this file is used to connect to the database
var mysql=require('mysql');
var connection=mysql.createConnection({
    host:'localhost',
    database:'restaurants',
    user:'root',
    password: 'anuj'
});
module.exports=connection;
    
    