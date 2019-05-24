function push(timer)
{
	if (timer != "")
	{
		timer = timer * 1000;
		console.log(timer)
		rtimer = timer - 5;
		//setTimeout('recargar()', rtimer);
		setTimeout('flotante()', timer);
	}
}

function recargar()
{
	var dir = document.getElementById("poa").src;
	document.getElementById("poa").src = dir + "&action=1";
}

function cerrar_float()
{
	var dir = document.getElementById("poa").src;
	var flo = document.getElementById("float");
	
	flo.style.display = "none";
	document.getElementById("poa").src = dir + "&action=2";
}

function flotante()
{
	var flo = document.getElementById("float");
	flo.style.display = 'block';
	setTimeout('animacion()', 500);
	//save_data('Abandono');
}

function animacion()
{
	var flo = document.getElementById("float");
	flo.style.margin = '284px 0 0 0';
}

var scrollDivs=new Array();
scrollDivs[0]="float";

function carga()
{
	posicion=0;
	
	// IE
	if(navigator.userAgent.indexOf("MSIE")>=0) navegador=0;
	// Otros
	else navegador=1;

	registraDivs();
}

function registraDivs()
{
	for(divId in scrollDivs)
	{
		document.getElementById(scrollDivs[divId]).onmouseover=function() { this.style.cursor="move"; }
		document.getElementById(scrollDivs[divId]).onmousedown=comienzoMovimiento;
	}
}

function evitaEventos(event)
{
	// Funcion que evita que se ejecuten eventos adicionales
	if(navegador==0)
	{
		window.event.cancelBubble=true;
		window.event.returnValue=false;
	}
	if(navegador==1) event.preventDefault();
}

function comienzoMovimiento(event)
{
	var id=this.id;
	elMovimiento=document.getElementById(id);
	
	 // Obtengo la posicion del cursor
	 
	if(navegador==0)
	 {
	 	cursorComienzoX=window.event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
		cursorComienzoY=window.event.clientY+document.documentElement.scrollTop+document.body.scrollTop;
	}
	if(navegador==1)
	{    
		cursorComienzoX=event.clientX+window.scrollX;
		cursorComienzoY=event.clientY+window.scrollY;
	}
	
	elMovimiento.onmousemove=enMovimiento;
	elMovimiento.onmouseup=finMovimiento;
	
	elComienzoX=parseInt(elMovimiento.style.right);
	elComienzoY=parseInt(elMovimiento.style.top);
	// Actualizo el posicion del elemento
	elMovimiento.style.zIndex=++posicion;
	
	evitaEventos(event);
}

function enMovimiento(event)
{  
	var xActual, yActual;
	if(navegador==0)
	{    
		xActual=window.event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;
		yActual=window.event.clientY+document.documentElement.scrollTop+document.body.scrollTop;
	}  
	if(navegador==1)
	{
		xActual=event.clientX+window.scrollX;
		yActual=event.clientY+window.scrollY;
	}
	elMovimiento.style.right=(elComienzoX-xActual+cursorComienzoX)+"px";
	elMovimiento.style.top=(elComienzoY+yActual-cursorComienzoY)+"px";

	evitaEventos(event);
}

function finMovimiento(event)
{
	elMovimiento.onmousemove=null;
	elMovimiento.onmouseup=null;
}

window.onload=carga;