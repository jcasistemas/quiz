var models = require('../models/models.js');

// Paso 18 - Moderación de Comentarios	
exports.load = function(req, res, next, commentId) {
  models.Comment.find( 
	  	{ where: { id: Number(commentId) }
	  	}

  	).then( function( comment ) {
      if (comment) {
        req.comment = comment;
        next();
      }
      else {
      	next( new Error('No existe el comentario Nº. ' + commentId));
      	// Me parece mejor así gestionar el error
		// res.render('quizes/respuesta', { quizId: quizId, respuesta: 'Error', errors: [] });
      }
    }
  ).catch(function(error) { next(error); });
};


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

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
	.then( function(){ res.redirect('/quizes/'+ req.params.quizId ); })
	.catch( function( error ) { next( error) });
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.unpublish = function(req, res) {
	req.comment.publicado = false;

	req.comment.save( {fields: ["publicado"]})
	.then( function(){ res.redirect('/quizes/'+ req.params.quizId ); })
	.catch( function( error ) { next( error) });
};


