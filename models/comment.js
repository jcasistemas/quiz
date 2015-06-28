// Paso 15 - Crear Comentarios
// Definicion de la tabla Comment
module.exports = function(sequelize, DataTypes) {
  	return sequelize.define('Comment', // El nombre de la tabla a utilizarse en el resto de la aplicación
		{ texto: {
		  	type: DataTypes.STRING,
		  	validate: { notEmpty: { msg: "Introduzca el Comentario" } }
		  },
		  publicado: { // Paso 18 - Moderación de Comentarios
		  	type: DataTypes.BOOLEAN,
		  	defaultValue: false
		  }
		},
    // Función agregada para contar Preguntas con Comentarios
    {
      classMethods: {
        preguntasConComentarios: function () {
          return this.count( { group: '"QuizId"'})
          .then(function (result) {
            return result.length;
          });
        }
      }
    }

	);
}
