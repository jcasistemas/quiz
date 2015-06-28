// Paso 20 - Estadísticas y Caducar Sesión
var models = require('../models/models.js'); // Dirección del modelo

var est = [ // Array de 7 objetos que mostrará las estadísticas en /views/statistics/show.ejs
			{ "tit": "Número de Preguntas", "val": 0 },
			{ "tit": "Número de Comentarios", "val": 0 },
			{ "tit": "Promedio de Comentarios por Pregunta", "val": 0 },
			{ "tit": "Preguntas con Comentarios", "val": 0 },
			{ "tit": "Preguntas sin Comentarios", "val": 0 },
			{ "tit": "Número de Comentarios Publicados", "val": 0 },
			{ "tit": "Número de Comentarios sin Publicarse", "val": 0 }
		]; 

var errors = [];

exports.estadisticas = function(req, res, next){

	var numPre=0, numCom=0, numComPub=0, promedio=0, preConCom=0, pregAnterior=-1;

	// Contar el total de Preguntas
	models.Quiz.count()
	.then(function (result) {
		numPre =  result;

		// Contar el total de Comentarios
		return models.Comment.count();
	})
	.then(function (result) {
		numCom =  result;

		// Obtener el promedio de comentarios por pregunta
		promedio = (numPre > 0 ) ? numCom/numPre : 0;

		// Contar el total en número de Preguntas con Comentarios
		return models.Comment.preguntasConComentarios();
	})
	.then(function (result) {
		preConCom = result;
		// Contar los comentarios que han sido Publicados (true)
		return models.Comment.count( {
			where: { publicado: true } } );
	})
	.then(function (result) {
		numComPub = result;
		// Asignar resultados al objeto que mosstrará las estadísticas
		est[0].val = numPre;
		est[1].val = numCom;
		est[2].val = +promedio.toFixed(2);
		est[3].val = preConCom;
		est[4].val = numPre-preConCom;
		est[5].val = numComPub;
		est[6].val = numCom-numComPub;
	}).catch( function (err) { errors.push(err); })
	.finally(function() {
		next()
	});
};

// GET /quizes/:id
exports.show = function( req, res) {
	res.render('statistics/show', { estadisticas: est, errors: [] });
};
