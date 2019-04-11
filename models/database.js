var mysql=require('mysql');

var con=mysql.createConnection({
  host:"localhost",
  user:"abhishek",
  password:"",
  database:"student_record"
});

module.exports=con;