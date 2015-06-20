var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new', { quizId: req.params.quizId, pregunta: req.query.pregunta, errors: [] } );
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	var comment = models.Comment.build( {
		texto: req.body.comment.texto,
		QuizId: req.params.quizId }
	);
	comment.validate().then( function(err){
		if( err ) {
			res.render('comments/new', { quizId: req.params.quizId, pregunta: req.body.pregunta, errors: err.errors} );
		} else {
			comment.save()
			.then(function() { res.redirect('/quizes/' + req.params.quizId ) } )
		}
		
	}).catch(function(error){ console.log("\n\nError en Comentario !!!\n\n"); });
};
