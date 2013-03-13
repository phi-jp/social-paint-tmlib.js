
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Social Paint with tmlib.js', port: req.app.settings.port });
};