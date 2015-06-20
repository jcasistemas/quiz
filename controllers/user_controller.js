// Paso 16 - Autenticación y Sesión
var users = { admin: { id:1, username:"admin", password: "1234" },
			  pepe:  { id:2, username: "pepe", password: "5678" }
};

// Verifica si el usuario está reigstrao en users
// Si la autenticación falla o hay un error, se ejecuta el callback(error)
exports.autenticar = function(login, password, callback) {
	if( users[login] ) {
		if( password === users[login].password ) {
			callback(null, users[login] );
		} else {
			callback( new Error( 'Password erróneo.'));
		}
	} else { 
		callback( new Error('El usuario no existe') ); 
	}
};
