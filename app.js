const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require ('connect-flash');
const session = require('express-session');
const multer = require('multer');
const passport = require('passport');
const path = require('path');
const image2base64 = require('image-to-base64');
const bodyParser = require('body-parser')
const {ensureAuthenticated} = require('./config/auth')


const image = require('./models/image');
const user = require('./models/User');
const Comment =require('./models/Comment')

const app = express();

//passport config
require ('./config/passport')(passport);


//set public folder
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
//set the storage engine



const storage = multer.diskStorage({
    destination: './public/upload/',
    filename: function(req,file,cb){
     cb(null,file.fieldname + '-' + Date.now() + 
     path.extname(file.originalname));
    }
  });
//init upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter:function(req, file, cb){
      checkFileType(file,cb);
    }
  }).single('my image');
  
  //check file type
  function checkFileType(file,cb){
  //allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  //check ext
  const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype);
  
  if(mimetype && extname){
    return cb(null,true);
  }else{
    cb("error:image only");
  }
  };


// DB config

const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true})
    .then(()=> console.log('mongoose connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//body parser
app.use(express.urlencoded({extended: false}));

// express-session middleware
app.use(session({
    secret: 'secret ',
    resave: true,
    saveUninitialized: true
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash
  app.use(flash());

  // global vars
  app.use((req, res, next)=>{
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');      
      next();
  } );

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


app.post('/upload', (req,res) => {
  
    upload(req,res,(err) => {
      if(err){
        res.render('image_add',{
          msg:err
        });
      }else{
        if(req.file == undefined){
          res.render('image_add',{
            msg:'error: nothing selected'
          })
        }else{
          image2base64('./public/upload/'+req.file.filename) // you can also to use url
    .then(
        (response) => {
           const code= response; //cGF0aC90by9maWxlLmpwZw==
           
          let img = new image({
            img_name : req.file.filename,
            caption:req.body.imgDesc,
            img_title:req.body.imgTitle,
            name:req.body.name,
            code:code
           
          })
          img.save(function(err){
            if(err){
              console.log(err)
            }
            else{
              console.log('File uploaded succesfully !!!! ');
              console.log(req.file.filename);
            }
          })
          }

    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )

          res.render('image_add',{
            msg:'file uploaded',
            file:`upload/${req.file.filename}`
          })
        }
      }
    })
    });

    
    app.get('/desc/:id',ensureAuthenticated,function(req,res){
        // let simage=req.params.id
        image.findById({_id:req.params.id},function(err, abcd){
          if(err){
            console.log(err);
          }else{
           res.render('descp',{
           
            desc: abcd
          
        })
        }
        })
        // res.render('descp')
        });
    
       

        
  

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log('server started on port 5000') );

