// GET /quizes/pregunta
var models = require('../models/models.js'); // Dirección del modelo

// Autoload - Se refactoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find( 
	  	{ where: { id: Number(quizId) },
	  	  include: [ { model:models.Comment}]
	  	}

  	).then( function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      }
      else {
      	// next( new Error('No existe la pregunta Nº. ' + quizId));
      	// Me parece mejor así gestionar el error
		res.render('quizes/respuesta', { quizId: quizId, respuesta: 'Error', errors: [] });
      }
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then( function(quizes) {
		res.render('quizes/index', { quizes: quizes, subtitulo: "", errors: [] });
	}).catch(function(error) { next(error); })
};

// GET /quizes/:id
exports.show = function( req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: [] } );
};

// GET /quizes/:id/respuesta
exports.respuesta = function( req, res) {
	var resultado = "Incorrecto";
	if (req.query.respuesta === req.quiz.respuesta ) {
		resultado = "Correcto";
	}
	res.render('quizes/respuesta', { quiz: req.quiz, respuesta: resultado, errors: [] } );
};

//Paso 11 - Crear preguntas
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
				{ pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro" }
			);
		res.render('quizes/new', { quiz: quiz, errors: [] } );
};
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	// Paso 12 - Validación de error (Campo vacio)
	// Funciona al Instalar sequielize@2.0.0
	quiz.validate().then( function(err){
			if( err ) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors} );
			} else {
				// Quitar espacios al comienzo y al final de lo enviado en el formulario
				quiz.pregunta = quiz.pregunta.trim();
  				quiz.respuesta = quiz.respuesta.trim();
    			quiz.tema = quiz.tema
				// Se guarda en la BD los 2 campos que vienen en quiz de POST
				// Se enumera los campos para evitar que hagan inyeccion de codigo
				quiz.save( { fields: ["pregunta", "respuesta", "tema"] } ).then(function() {
					res.redirect('/quizes' ) } )
			}
		}
	);
};

// Paso 13 - Edición - GET /quizes/:id/edit
exports.edit = function( req, res) {
	var quiz = req.quiz; // vienen los parametros con valor por el Autoload
		res.render('quizes/edit', { quiz: quiz, errors: [] });
};
//PUT /quizes/:id
exports.update = function( req, res) {
  // Se asigna a req.quiz porque es un objeto que tiene todos los métodos
  // Y propiedades de sequelize
  // Quitar espacios al comienzo y al final de lo enviado en el formulario
  req.quiz.pregunta = req.body.quiz.pregunta.trim();
  req.quiz.respuesta = req.body.quiz.respuesta.trim();
  req.quiz.tema = req.body.quiz.tema.trim();

// console.log("\n", req.quiz, "\n" );
// console.log("\n", req.body.quiz, "\n" );

  req.quiz.validate().then( function(err){
      if( err ) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors} );
      } else {
        req.quiz.save( { fields: ["pregunta", "respuesta", "tema"] } ).then(function() {
          res.redirect('/quizes' ) } )
      }
    }
  );
};

// Paso 14 - Borrar - DELETE /quizes/:id
exports.destroy = function( req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){ next(error)});
};


//Get /quizez/creditos
exports.autor = function( req, res) {
	res.render("quizes/autor", {title: "EQUIPO DE DESARROLLO", errors: [] });
};

// colocar buscador (Fin Tema 9)
//Get /quizes/:search
exports.buscar = function( req, res) {
	// Validar que el nombre del parametro exista (No se haya modificado en la ruta)
	if( req.query.search === undefined ) {
		res.render('quizes/index', { quizes: {}, subtitulo: "No es posible efectuar la búsqueda", errors: [] });
	} else {
		// Validar que se haya escrito a menos un caracter para buscar
		if( req.query.search.length === 0 ) {
			res.render('quizes/index', { quizes: {}, subtitulo: "Escriba algun texto a buscar", errors: [] });
		} else {
// console.log("Largo=" + req.query.search.length )
			// Procesar el texto recibido a un formato adecuado para la búsquda
			cadena = req.query.search;
			console.log("\nRecibi: '" + cadena + "'" );
			// Eliminar espacios al comienzo y al final de la respuesta
			cadena = cadena.trim();
			// Eliminar mas de un espacio contiguo entre palabras
			cadena = cadena.replace(/\s+/g, ' ');
			// Reemplazar los espacios encontrados ' ' por el caracter %
			cadena = cadena.replace(/\s/g, '%');
			// Colocar el texto a buscar entre los caracteres '%'
			cadena = '%' + cadena + '%';
			console.log("Proceso: '" + cadena + "'\n");

      // Busqueda de las palabras y mostrando el resultado de forma ASCendente
			models.Quiz.findAll(
        { where: [ "pregunta like ?", cadena ],
          order: [[ 'pregunta', 'ASC' ]] } ).then( function(quizes) {
				    // Mensaje a mostrar de acuerdo al resultado de la búsqueda
    				var elSubtitulo = quizes.length + " Pregunta" + ( quizes.length===1?"":"s") + " con el patrón: '" + req.query.search.trim() + "'";
    				res.render('quizes/index', { quizes: quizes, subtitulo: elSubtitulo, errors: [] });
			}).catch(function(error) { next(error); })
		}
	}
};
