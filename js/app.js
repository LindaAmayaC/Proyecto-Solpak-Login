var globalCedula="";
var allowedActions=false;

function initializeApp(){
	console.log("inicializo");
	$("#container-loading").hide();
	//$("#btn-ingresar").click(accionBotonIngresar());
	$("#btn-entrada").click(accionBotonEntrada());
	$("#btn-salida").click(accionBotonSalida());
}
//programando evento click de los botones
function accionBotonIngresar(){
	console.log("Entra a accion ingresar"); 
	var txtCedula=document.getElementById("cedula").value;
	if(validarCampoCedula(txtCedula)){
		console.log(txtCedula);
		$("#container-loading").show();
		setTimeout(function(){$("#container-loading").hide();}, 4000);
		validarExistenciaUsuario(txtCedula);
		limpiarCampos();
		alertify.success('documento recibido');
	}
	else{
		alertify.error("Documento no valido");
	}
	
}
//Esta función recibe la cédula del usuario que se quiere validar y se valida si el usuario existe o no utilizando el Api de Bitrix24   
function validarExistenciaUsuario(txtCedula){
	//Aca va lo de bitrix validando que el usuario exista y sacando el user id y guardandolo
	//en algun lado o devolviendolo
	// BX24.callMethod("user.get",
	// 	{"ID":txtCedula},
	// 	function(result){
	// 		var user = result.data()[0];
	// 		console.log(user);
	// 		if(user){
	// 			habilitarBotones(txtCedula);
	// 		}
	// 		else{
	// 			alertify.error('El usuario no se encuentra registrado en el sistema');
	// 			globalCedula="";
	// 		}
	// 	});
	console.log("entro a vlaidar usuario");
}
function accionBotonEntrada(){
	//Aca va lo de bitrix enviando el registro de entrada
	if(allowedActions){
		BX24.callMethod("timeman.open",
			{"USER_ID":globalCedula},
			function(result){
				var openUser=result.data().STATUS;
				console.log(openUser);
				if(openUser=="OPENED"){
					alertify.success("Registro de entrada exitoso.");
				}
				else{
					alertify.error('Error en marcar entrada');
				}
				disableButtons();
				globalCedula="";
				allowedActions=false;
			});
	}
}
function accionBotonSalida(){
	//Aca va lo de bitrix enviando el registro de salida
	if(allowedActions){
		BX24.callMethod("timeman.close",
			{"USER_ID":globalCedula},
			function(result){
				var closeUser=result.data().STATUS;
				console.log(closeUser);
				if(closeUser=="CLOSED"){
					alertify.success("Registro de salida exitoso.");
				}
				else{
					alertify.error('Error en marcar salida');
				}
				disableButtons();
				globalCedula="";
				allowedActions=false;
			});
	}
	console.log("entro a accion boton salida");
}
function habilitarBotones(userID){
	BX24.callMethod("timeman.status",
		{"USER_ID":userID},
		function(result){
			var statusUser=result.data().STATUS;
			console.log(statusUser);
			if(statusUser=="OPENED"){
				document.getElementById("btn-salida").disabled=false;
			}
			else{
				document.getElementById("btn-entrada").disabled=false;
			}
			globalCedula=txtCedula;
			allowedActions=true;
		});
	console.log("entro a habilitar botones");
	
}

function disableButtons(){
	document.getElementById("btn-salida").disabled=true;
	document.getElementById("btn-entrada").disabled=true;

}
function validarCampoCedula(txtCedula){
	var numbers = /^[0-9]+$/;
	if (txtCedula.match(numbers) && txtCedula !== "") {
		return true;
	} 
	return false;
}
function limpiarCampos(){
	document.getElementById("cedula").value="";
}  
