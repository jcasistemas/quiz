// Paso 17 - Autorización - Accesos HTTP Restringidos
exports.loginRequired=function( req, res, next) {
	if ( req.session.user ) { 
console.log("\nSesion Activa ");           		
		next(); 
	}
	else { 
console.log("\nSin Sesion - Al Formulario ");           		
		res.redirect('/login'); 
	}
};

// Paso 16 - Autenticación y Sesión
// GET /login - Formulario
exports.new = function(req, res) {
//console.log("\nFormulario Sesion ", req.session.lastPage ); 
	
	// Verificar si el Login viene del botón o por redirección parra el mensaje.
	if( (typeof(req.query.l) !== 'undefined') && (req.query.l == "1" ) ) { 
		if( (typeof(req.session.estado) !== 'undefined') ) { 
			req.session.estado.expirada = false;
		}
	}
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', { errors: [], login: '' } );
};

// POST /login - Crear Sesión
exports.create = function(req, res) {
console.log("\nCreando Sesión ... ");           
           
	var login = req.body.login;
	var password = req.body.password;
	var userController = require( './user_controller');
	
	if( (typeof(req.session.estado) !== 'undefined') ) { 
		req.session.estado.expirada = false;
	}

	userController.autenticar( login, password, function(error, user, usuario ){
console.log("\nAutenticando Sesión ... ");           
		if( error ) { // Se retorna error de sesión al haber error
console.log("\n ... Error en Sesión");           			
			req.session.errors = [ { 'message': error.message } ];
res.render('sessions/new', { errors: req.session.errors, login: usuario } );			
			// res.redirect('/login');
			return;
		}
console.log("\n ... En sesion ... ");           					
		// Crear req.session.user y guarda los campos: id y username
		// La sesión se define por la existencia de: req.session.user
		// user.creada: Fecha y hora para controlar expiración
		req.session.user = { id: user.id, username: user.username, creada: new Date() };
		// estado.expirada: Para controlar el mensaje del formulario de Login
		req.session.estado = { expirada: false };		
		if( (typeof(req.session.redir) !== 'undefined') ) {  
			console.log("\nRedireccionando a: ", req.session.redir.toString() );	
			res.redirect( req.session.redir.toString() ); // Redirecciona a la ruta anterior al login
		} else {
			res.redirect( "/" ); // Redirecciona a la ruta anterior al login
		}
	});
};

// DELETE /logout - Destruir sesión
exports.destroy = function( req, res) {
console.log("\nEliminando Sesion ");        
	// Verificar si existe la sesión, que no fué eliminada por tiempo
	if ( req.session.user  ) {   	
		delete req.session.user;
		req.session.estado.expirada = false;
		res.redirect( req.session.redir.toString()); // Redirecciona a la ruta anterior al login
	} else {
		res.render('portada', { title: ' a Quiz !!!', errors: [ { 'message': "La Sesión ya habia expirado" } ] });
	}
}


