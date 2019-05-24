function ButtonClick_Test(nombre){
	try
	{
		nombre = nombre.split('<>')
		if (nombre[0]=='PasoAsesor')
		{
			console.log("Entro al paso a asesor")
			console.log(nombre)
			name = nombre[1]
			correo = nombre[2]
			documento= nombre[3]
			numero = nombre[4]
			asunto = nombre[5]
			paso = 'Chat'
			$(document).ready(function(){
			    $('<form action="http://172.20.205.61/adminvisualivr/web/audio/redireccionar/" method="post">'+
			      "<input name='nombre' value="+'"'+name+'"/>'+
			      "<input name='documento' value="+'"'+documento+'"/>'+
			      "<input name='correo' value="+'"'+correo+'"/>'+
			      "<input name='telefono' value="+'"'+numero+'"/>'+
			      "<input name='asunto' value="+'"'+asunto+'"/>'+
			      "<input name='servicio' value="+'"'+paso+'"/>'+
			      '</form>').appendTo('body').submit();
			});
		}
		else if(nombre[0]==="contexto")
		{
			var asunto = nombre[1].split(">")
			var asuntoFinal = ""
			asunto.forEach(function(element, index) {
				console.log(index)
				console.log(asunto.length)
				// console.log(element)
			    if(index>3 && index <(asunto.length - 4))
			    {
			    	console.log(element)
			    	asuntoFinal = asuntoFinal + element + " > "
			    }
			    else
			    {
			    	asuntoFinal = "Necesita información General"
			    }
			});
			console.log(asuntoFinal)
			document.querySelector('#textInput').value = asuntoFinal
			ConversationPanel.pasoMensaje(document.querySelector('#textInput'))
			document.querySelector('#textInput').value = ""
		}
		else
		{
			document.querySelector('#textInput').value = nombre
			ConversationPanel.pasoMensaje(document.querySelector('#textInput'))
			document.querySelector('#textInput').value = ""
		}
	}
	catch(error)
	{
		console.log(error)
	}

}