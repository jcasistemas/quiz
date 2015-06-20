// Define como se construye todo el modelo
var path = require('path');

// Paso 8
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Paso 8
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Paso 15  - Crear comentario
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);
// Crear la relación entre las 2 tablas
Comment.belongsTo(Quiz);  // Relación 1-1
Quiz.hasMany(Comment);    // Relación 1 a N
exports.Quiz = Quiz; // exportar definición de tabla Quiz para usarla en otros lugares de la aplicacion
exports.Comment = Comment; // exportar definición de tabla Comment para usarla en otros lugares de la aplicacion

// Paso 2b. Inicializar la BD
// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // Quiz.count().success(function (count){
  // Versione anteriores de sequelize

  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      // Quiz.create( {pregunta: 'Capital de Italia',   respuesta: 'Roma'}
      // Se cambia método, para poder crear BD con VARIAS preguntas
      Quiz.bulkCreate(
        [ {pregunta: 'Capital de Italia',   respuesta: 'Roma',    tema: "Otro"},
          {pregunta: 'Capital de Portugal', respuesta: 'Lisboa',  tema: "Ciencia"},
          {pregunta: 'Capital de Colombia', respuesta: 'Bogotá',  tema: "Humanidades"}
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});
