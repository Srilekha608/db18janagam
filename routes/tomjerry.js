var express = require('express'); 
const costume_controlers= require('../controllers/costume'); 
var router = express.Router(); 
const secured = (req, res, next) => { 
    if (req.user){ 
      return next(); 
    } 
    req.session.returnTo = req.originalUrl; 
    res.redirect("/login"); 
  } 
 
/* GET costumes */ 
router.get('/', costume_controlers.costume_view_all_Page ); 
router.get('/detail',secured, costume_controlers.costume_view_one_Page); 

router.get('/create', costume_controlers.costume_create_Page); 
 
router.get('/update',secured, costume_controlers.costume_update_Page);

router.get('/delete',secured, costume_controlers.costume_delete_Page); 
module.exports = router; 
