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
app.use(session());

// Paso 12- edit
app.use( methodOverride('_method') );

app.use(express.static(path.join(__dirname, 'public')));

// Paso 16 - Autenticación y Sesión
app.use( function(req, res, next) {
    // Guarda ruta en seesion.redir para usarla luego de hacer login
    if( !req.path.match(/\/login|\/logout/) ) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas - Variable global locals
    res.locals.session = req.session;
    next();
})

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

module.exports = app;

console.log("\nSi inicia con foreman use: http://localhost/5000");
console.log("Si inicia con node use: http://localhost/3000\n");
