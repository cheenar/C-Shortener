var express = require('express');
var router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/link", function(req, res) {
    res.redirect(global.getURL(req.query.id));
});

router.post("/", function(req, res) {
    var link = global.addURL(req.body.url_link);;
    res.render("link", {url:req.header.host + "/link?id=" + link});
    
});

module.exports = router;