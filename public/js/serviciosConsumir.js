var bluemixHost = 'http://localhost:5000';
//var bluemixHost = 'https://vivaair.mybluemix.net';
var valorRetornar = {};
var prueba;
var res = [];

function servicioSoap(datosServicio) {
	try {
		return $.ajax({
				type: datosServicio.method,
				data: {
					nombreServicio: JSON.stringify(datosServicio),
				},
				url: bluemixHost + '/servicioGeneral',
			})
			.done(function (data) {
				console.log("data", data)
			})
			.fail(function (xhr) {
				console.log("xhr:", xhr)
			});
	} catch (error) {
		console.log(error)
	}
}

function consumoServiciosGeneral(peticion) {
	return new Promise(function (resolve, reject) {
		peticion.forEach(element => {
			var verificar = element.type
			try {
				switch (verificar) {
					case "soap":

						servicioSoap(element).then(function (result) {
							if (valorRetornar) {
								valorRetornar['respuestaCodigo'] = result.return.respuesta;
							} else {
								valorRetornar['respuestaCodigo'] = null;
							}
							resolve(valorRetornar);
						}).catch(function (error) {
							console.log('Error: ', error);
						});
						break;
					default:
						break;
				}

			} catch (error) {
				console.log(error)
				reject(valorRetornar);
			}
		});
	});
}