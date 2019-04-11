var express=require('express');
var db=require('../models/database');
var router=express.Router();

module.exports=router;

//GET student records
router.get('/manage',(req,res)=>{
  db.query("SELECT * FROM student",(err,result,fields)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render('manage',{
        result:result
      });
    }
  });
});

//GET input page
router.get('/',(req,res)=>{

  var eno="";
  var s_name="";
  var f_name="";
  var Class="";
  var ph_no="";
  var email="";
  var dob="";
  var skill="";

  res.render('index',{
    eno:eno,
    s_name:s_name,
    f_name:f_name,
    Class:Class,
    ph_no:ph_no,
    email:email,
    dob:dob,
    skill:skill
  });
});

//POST input page
router.post('/',(req,res)=>{

  req.checkBody('eno','Enrollment No. must not be empty').notEmpty().isNumeric();
  req.checkBody('s_name','Name must not be empty').notEmpty();
  req.checkBody('f_name','Father\'s Name must not be empty').notEmpty();
  req.checkBody('Class','Class must not be empty').notEmpty();
  req.checkBody('ph_no','Please enter valid phone No.').notEmpty().isNumeric().isLength({min:10,max:10});
  req.checkBody('email','Email must not be empty').notEmpty();
  req.checkBody('email','Please enter a valid email').isEmail();
  req.checkBody('dob','Date of Birth must not be empty').notEmpty();
  req.checkBody('skill','Skills must not be empty').notEmpty();

  var eno=req.body.eno;
  var s_name=req.body.s_name;
  var f_name=req.body.f_name;
  var Class=req.body.Class;
  var ph_no=req.body.ph_no;
  var email=req.body.email;
  var dob=req.body.dob;
  var skill=req.body.skill;

  var errors=req.validationErrors();

  if(errors){
    res.render('index',{
      errors:errors,
      eno:eno,
      s_name:s_name,
      f_name:f_name,
      Class:Class,
      ph_no:ph_no,
      email:email,
      dob:dob,
      skill:skill
    });
  }else{
    var sql=`INSERT INTO student(eno,s_name,f_name,class,ph_no,email,dob,skill) VALUES(${eno},"${s_name}","${f_name}","${Class}","${ph_no}","${email}","${dob}","${skill}")`;

    db.query("SELECT * FROM student WHERE eno="+eno,(err,row)=>{
      if(err){
        console.log(err);
      }
      else{
        if(row&&row.length){
          req.flash('danger','Student record already exists');
          res.render('index',{
            eno:eno,
            s_name:s_name,
            f_name:f_name,
            Class:Class,
            ph_no:ph_no,
            email:email,
            dob:dob,
            skill:skill
          });
        }
        else{
          db.query(sql,(err,row)=>{
            if(err){
              console.log(err);
            }
            else{
              req.flash('success','Student added successfully');
              res.redirect('/');
            }
          });
        }
      }
    });
  }
});

//GET edit records
router.get('/manage/edit-page/:id',(req,res)=>{

  db.query("SELECT * FROM student WHERE id="+req.params.id,(err,result,fields)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render('edit-page',{
        eno:result[0].eno,
        s_name:result[0].s_name,
        f_name:result[0].f_name,
        Class:result[0].class,
        ph_no:result[0].ph_no,
        email:result[0].email,
        dob:result[0].dob,
        skill:result[0].skill,
        id:result[0].id
      });
    }
  });
});

//POST edit records
router.post('/manage/edit-page/:id',(req,res)=>{

  req.checkBody('eno','Enrollment No. must not be empty').notEmpty().isNumeric();
  req.checkBody('s_name','Name must not be empty').notEmpty();
  req.checkBody('f_name','Father\'s Name must not be empty').notEmpty();
  req.checkBody('Class','Class must not be empty').notEmpty();
  req.checkBody('ph_no','Please enter valid phone No.').notEmpty().isNumeric().isLength({min:10,max:10});
  req.checkBody('email','Email must not be empty').notEmpty();
  req.checkBody('email','Please enter a valid email').isEmail();
  req.checkBody('dob','Date of Birth must not be empty').notEmpty();
  req.checkBody('skill','Skills must not be empty').notEmpty();

  var eno=req.body.eno;
  var s_name=req.body.s_name;
  var f_name=req.body.f_name;
  var Class=req.body.Class;
  var ph_no=req.body.ph_no;
  var email=req.body.email;
  var dob=req.body.dob;
  var skill=req.body.skill;
  var id=req.body.id;

  var errors=req.validationErrors();

  if(errors){
    res.render('edit-page',{
      errors:errors,
      eno:eno,
      s_name:s_name,
      f_name:f_name,
      Class:Class,
      ph_no:ph_no,
      email:email,
      dob:dob,
      skill:skill,
      id:id
    });
  }else{
    var sql=`UPDATE student SET id=${id},s_name="${s_name}",f_name="${f_name}",class="${Class}",ph_no="${ph_no}",email="${email}",dob="${dob}",skill="${skill}" WHERE eno=${eno}`;

    db.query("SELECT * FROM student WHERE eno="+eno,(err,row)=>{
      if(err){
        console.log(err);
      }
      else{
        if(row&&row.length){
          db.query(sql,(err,row)=>{
            if(err){
              console.log(err);
            }
            else{
              req.flash('success','Student data updated successfully');
              res.redirect('/manage');
            }
          });
        }
      }
    });
  }
});

//Delete student records
router.get('/manage/delete-page/:id',(req,res)=>{
  db.query("DELETE FROM student WHERE id="+req.params.id,(err,result,fields)=>{
    if(err){
      console.log(err);
    }
    else{
      req.flash('success','Student data deleted successfully');
      res.redirect('/manage');
    }
  });
});