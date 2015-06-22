// Paso 15 - Crear Comentarios
// Definicion de la tabla Comment
module.exports = function(sequelize, DataTypes) {
  	return sequelize.define('Comment',
		{ texto: {
		  	type: DataTypes.STRING,
		  	validate: { notEmpty: { msg: "Introduzca el Comentario" } }
		  },
		  publicado: { // Paso 18 - Moderación de Comentarios	
		  	type: DataTypes.BOOLEAN,
		  	defaultValue: false
		  },
		  id: { // Paso 18 - Moderación de Comentarios	
		  	type: DataTypes.STRING
		  }
		}
	);
}
