// Definicion de la tabla Comment
module.exports = function(sequelize, DataTypes) {
  	return sequelize.define('Comment',
		{ texto: {
		  	type: DataTypes.STRING,
		  	validate: { notEmpty: { msg: "Introduzca el Comentario" } }
		  }
		}
	);
}
