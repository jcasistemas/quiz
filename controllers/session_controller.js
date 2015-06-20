// Paso 16 - Autenticación y Sesión
// GET /login - Formulario
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
console.log("\n*** Al Formulario ...\n",  req.session );	
	res.render('sessions/new', { errors: errors } );
};

// POST /login - Crear Sesión
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var userController = require( './user_controller');

	userController.autenticar( login, password, function(error, user ){

		if( error ) { // Se retorna error de sesión al haber error 
console.log("\Error al crear Sesión ...\n", error )			
			req.session.errors = [ { 'message': 'Error al crear sesion' }, { 'message': error.message } ];
			res.redirect('/login');
			return;
		} 
		// Crear req.session.user y guarda los campos: id y username
		// La sesión se define por la existencia de: req.session.user
console.log("\nCreando Sesión ...\n",  req.session );
		req.session.user = { id: user.id, username: user.username };
		res.redirect( req.session.redir.toString() ); // Redirecciona a la ruta anterior al login
	});
};

// DELETE /logout - Destruir sesión
exports.destroy = function( req, res) {
console.log("\nBorrando Sesión ...\n",  req.session );
	delete req.session.user;
	res.redirect( req.session.redir.toString()); // Redirecciona a la ruta anterior al login
}
