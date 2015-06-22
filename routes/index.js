var express = require('express');
var router = express.Router();

// Paso 2 - Importar el controlador de quizes
var quizController = require('../controllers/quiz_controller');
// Paso 15 - Importar el controlador de comentarios
var commentController = require('../controllers/comment_controller');
// Paso 16 - Autenticación y Sesión
// Importar el controlador de sesiones
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('portada', { title: ' a Quiz !!!', errors: [] });
});

// Paso 8 - Autoload
// Autoload de comandos con el parametro :quizId
router.param('quizId', quizController.load);

// Paso 18 - Moderación de Comentarios	
// Autoload de comandos con el parametro :commentId
router.param('commentId', commentController.load);

//Paso 16 - Autenticación y Sesión
router.get('/login', 	sessionController.new); // Formulario Inicio Sesión (Login)
router.post('/login', 	sessionController.create); // Crear Sesion
router.get('/logout', 	sessionController.destroy); // Destruir sesión

// Paso 9 - Multiples preguntas
// Definición de rutas de /quizes
router.get('/quizes',                      	quizController.index);
router.get('/quizes/:quizId(\\d+)',        	quizController.show);
router.get('/quizes/:quizId(\\d+)/respuesta', quizController.respuesta);

// Paso 17 - Autorización - Introducir MW sessionController.loginRequired, 
//Paso 11 - Crear preguntas
router.get('/quizes/new',    			sessionController.loginRequired, quizController.new);
router.post('/quizes/create',         	sessionController.loginRequired, quizController.create);
// Paso 13 - Edición
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',    	sessionController.loginRequired, quizController.update);

// Paso 14 - Borrar
router.delete('/quizes/:quizId(\\d+)',		quizController.destroy);

// Paso 15 - Crear comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',   commentController.create);
// Paso 18 - Moderación de Comentarios	
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
										sessionController.loginRequired, commentController.publish);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/unpublish', 
										sessionController.loginRequired, commentController.unpublish);

// colocar buscador (Fin Tema 9)
router.get('/quizes/search',                quizController.buscar);

router.get('/quizes/autor', quizController.autor);

// Para cualquier ruta Inexistente
router.get( '*', function(req, res) {
  res.render('portada', { title: '' });
});

module.exports = router;
