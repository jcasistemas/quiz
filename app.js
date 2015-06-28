var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Paso 6- Layouts
var partials = require('express-partials');
// Paso 12- Editar
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

// Eliminado de Version 0
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Paso 6- Layouts
app.use(partials());

// Descomentada para Version 1 o colocar Link Rel en la vista html
// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());

// Paso 11 - Crear preguntas
// Se coloca en true o se elimina para que guarde los campos que le dice el controlador
app.use(bodyParser.urlencoded({ extended: true }));

// Paso 16 - Autenticación y Sesión
app.use(cookieParser('LaGata'));

// Paso 20 - Estadísticas y Caducar Sesión
// app.use(session());
app.use( session( {
        secret: 'LaGata',
        resave: false,
        saveUninitialized: true
} ) );


// Paso 12- edit
app.use( methodOverride('_method') );

app.use(express.static(path.join(__dirname, 'public')));

// Paso 16 - Autenticación y Sesión
app.use( function(req, res, next) {
console.log("\nGuardando ruta: ", req.path );    
    // Guarda ruta en seesion.redir para usarla luego de hacer login
    if( !req.path.match(/\/login|\/logout/) ) {
        req.session.redir = req.path;
    } 

    // Hacer visible req.session en las vistas - Variable global locals
    res.locals.session = req.session;
    next();
})

// Desconectar luego de superar tiempo de inactividad maximo (2 minutos)
app.use(function (req, res, next) {
// console.log("\nObjeto req.session: ", req.session);
console.log("\nObjeto req.session: ", req.session);
    var maximoTiempoInactividad = 30000; // En milisegundos
    if ( req.session.user  ) {
console.log("\nCON SESION !!! ...\nDatos de Sesion: ", req.session.user );
      var horaCreadaSesion = new Date(req.session.user.horaCreada);

      if ( (new Date() - horaCreadaSesion) > maximoTiempoInactividad ) {
        // eliminar la sesión luego de N segundos de inactividad
        req.session.estado.expirada = true ;        
        delete req.session.user;
console.log("\nSesion Terminada, Ir a: ", req.session.redir.toString(), "\n")
        // res.redirect( req.session.redir.toString()); // Redirecciona a la ruta llamada
      } else {
        // Colocar hora actual para empezar a contar N segs. de Inactividad
        req.session.user.horaCreada = new Date();
        req.session.estado.expirada = false;                
      }
    } else {
      console.log("\n\nSIN SESION !!! ...\n" );
    }
    next();
});

app.use('/', routes);

// Eliminado de Version 0
// app.use('/users/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Pagina no encontrada :(');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8000);

module.exports = app;

console.log("\n\t* Si inicia con foreman use: http://localhost:5000");
console.log("\n\t* Si inicia con node use: http://localhost:3000");
console.log("\n\t\tO indistintamente utilizar: http://localhost:8000\n");
console.log("\n\t* Para usar Servidor seguro utilizar: https://localhost/8443\n");
