var currentdate = new Date();
var datetime = formatAMPM(currentdate);
var countModalsViva = 0;
var countAccordion = 0;
//var bluemixHost = "http://localhost:5000";
var bluemixHost = 'https://vivaair.mybluemix.net'

function ArmarBotones(texto, nodoDialog) {
    var cabecera, cuerpo, final = "";
    var itemsCatalog = [];
    var scrollImage = false;
    var objConversation = document.getElementById("pane-conversation");

    try {
        texto = texto.replace(new RegExp(/[|]{2}/g, 'g'), "<br>")

        if (texto.indexOf("((Imagen slide: ") !== -1) {
            var itemsCatalog = [];
            var imagenSlide = texto.split("((Imagen slide: ");


            for (var i = 0; i < imagenSlide[1].split("tablet/")[1].split(".jpg")[0]; i++) {
                if (imagenSlide[1].split("tablet/")[0] + (i + 1)) {
                    var imgCatalog = {
                        src: `${imagenSlide[1].split("tablet/")[0] + "tablet/" + (i + 1)}.jpg`,
                        thumb: `${imagenSlide[1].split("tablet/")[0] + "tablet/" + (i + 1)}.jpg`,
                    };
                    itemsCatalog.push(imgCatalog);
                }
            }

            texto = `<div class="row center">
						<div class="col d-block">
							<div class="imageCatalogContainer mx-auto">								
								<a class="imageCatalog">
									<i class="fas fa-search-plus"></i>
									<img src="${imagenSlide[1].split("tablet/")[0] + 'tablet/'}1.jpg" class="hover-shadow cursor" />
								</a>
							</div>
						</div>
					 </div> ${imagenSlide[1].split("))")[1]}`;

            scrollImage = true;

            if (scrollImage) {
                $(".pane-conversation").animate({
                    scrollTop: objConversation.scrollHeight - 210
                }, 1000);
                scrollImage = false;
            } else {
                $(".pane-conversation").animate({
                    scrollTop: objConversation.scrollHeight
                }, 1000);
            }

            jQuery(function () {
                if (itemsCatalog.length > 0) {
                    $(".imageCatalog").on("click", function () {
                        $(this).lightGallery({
                            dynamic: true,
                            dynamicEl: itemsCatalog,
                            share: false
                        });
                    });
                }
            });
        }

        if (texto.indexOf("[[accordion: ") !== -1) {
            texto = accordion(texto);
        }

        if (texto.indexOf("((tabs: ") !== -1) {
            texto = tabs(texto);
        }

        if (texto.indexOf("((captcha: ") !== -1) {
            texto = `<div id="captcha_container"></div>
            <div class="pane-action d-none">
            <div class="action-container">
              <input id="textInput" class="chat-input animated" placeholder="Escribe aquí" autofocus=true/>
              <a class="icon-send" href="javascript:void(0)">
                <i class="fas fa-paper-plane"></i>
              </a>
            </div>
          </div>`;
        }

        if (texto.indexOf("((encuesta estrella: ") !== -1) {
            texto = surveyStars(texto);
        }

        if (texto.indexOf("((boton enlace: ") !== -1) {
            texto = Enlace(texto)
        }

        if (texto.indexOf("((boton link: ") !== -1) {
            texto = botonLink(texto)
        }

        if (texto.indexOf("((boton imagen enlace: ") !== -1) {
            texto = imagenEnlace(texto)
        }

        if (texto.indexOf("((botones seleccion: ") !== -1) {
            texto = botonesSeleccion(texto)
        }

        if (texto.indexOf("((imagen modal: ") !== -1) {
            texto = ModalImage(texto)
        }

        if (texto.indexOf("((video: ") !== -1) {
            texto = Video(texto);
        }

        if (texto.indexOf("((boton descarga: ") !== -1) {
            var descarga = texto.split("((boton descarga: ")
            for (var i = 0; i < descarga.length; i++) {

                //<a href="../img/myfile.pdf">Click to Download!</a>
                if (descarga[i].indexOf(";") !== -1) {
                    if (descarga[i].split("))").length > 3) {
                        texto = texto + '<a href="' + bluemixHost + '/img/' + descarga[i].split("))")[0].split(";")[1] + '.pdf" target="_blank">' + descarga[i].split("))")[0].split(";")[0] + '</a>' +
                            descarga[i].split("))")[1] + '))' + descarga[i].split("))")[2]
                    } else {
                        texto = texto + '<a href="' + bluemixHost + '/img/' + descarga[i].split("))")[0].split(";")[1] + '.pdf" target="_blank">' + descarga[i].split("))")[0].split(";")[0] + '</a>' +
                            descarga[i].split("))")[1]
                    }
                } else {
                    texto = descarga[i]
                }
            }
            //texto = descarga[0] + '<a href="'+descarga[1].split("))")[0].split(";")[1]+'" target="_blank">'+descarga[1].split("))")[0].split(";")[0]+'</a>' + 
            //enlace[1].split("))")[1]+'))'
        }

        // if (texto.indexOf("((") === -1) {
        //     var objConversation = document.getElementById("pane-conversation");
        //     texto = TextoPlano(texto)
        //     return texto;
        // }

        return `<div class="from-watson latest top">
            <div class="msj macro">
                <div class="text text-r">
                    ${texto}
                </div>					
            </div>
        </div>`;

        var botones = texto.split("((botones seleccion: ")
        cabecera = Cabecera(botones);
        cuerpo = Cuerpo(botones);
        //final = `</div></div><small class="time text-right">${datetime}</small>`;
        final = `</div></div>`;

        return cabecera + cuerpo + final;

    } catch (error) {
        console.log("Error: ", error);
    }
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function TextoPlano(texto) {
    return `<div class="from-watson latest top">
				<div class="msj macro">
					<div class="text text-r">
						${texto}
					</div>					
				</div>
            </div>`;
    // return `<div class="from-watson latest top">
    // 			<div class="msj macro">
    // 				<div class="text text-r">
    // 					<p>${texto}</p>
    // 					<small class="time text-right">${datetime}</small>
    // 				</div>					
    // 			</div>
    // 		</div>`;
}

function Cabecera(botones) {
    return `<div class="from-watson latest top">
				<div class="msj macro">
				<div class="text text-r">
					<p>${botones[0]}</p>
					<div class="container-buttons text-center">
						<div class="row">`;
}

function Cuerpo(botones) {

    var contador = 1
    var cuerpo = ''
    botones[1].split(";").forEach(function (myString) {

        if (cuerpo === undefined) {
            contador = contador + 1;

            if (myString.replace(" ", "") == "Calificacion1" || myString.replace(" ", "") == "Calificacion2" || myString.replace(" ", "") == "Calificacion3" || myString.replace(" ", "") == "Calificacion4" || myString.replace(" ", "") == "Calificacion5") {
                cuerpo = `${cuerpo} <a class="social" onclick="ButtonClick_Test('${myString}')">                                        
                                        <img class="img-fluid" src="${bluemixHost}/img/${myString.replace(" ", "")}.png">
                                    </a>`;
            } else {
                cuerpo = `<div class="col-12">
							<button class="btn btn-primary btn-sm" type="button" onclick="ButtonClick_Test('${myString}')">
								${myString}
							</button>
						</div>`;
            }
        } else {
            if (myString.indexOf("))") !== -1) {
                myString = myString.replace("))", "")
                if (contador % 2 === 0) {

                    if (myString.replace(" ", "") == "Calificacion1" || myString.replace(" ", "") == "Calificacion2" || myString.replace(" ", "") == "Calificacion3" || myString.replace(" ", "") == "Calificacion4" || myString.replace(" ", "") == "Calificacion5") {
                        cuerpo = `${cuerpo} <a class="social" onclick="ButtonClick_Test('${myString}')">                                                
                                                <img class="img-fluid" src="${bluemixHost}/img/${myString.replace(" ", "")}.png">
                                            </a>`;
                    } else {
                        cuerpo = `${cuerpo} 
									<div class="col-12">
										<button class="btn btn-primary btn-sm" type="button" onclick="ButtonClick_Test('${myString}')">
											${myString}
										</button>
									</div>`;
                    }
                } else {
                    if (myString.replace(" ", "") == "Calificacion1" || myString.replace(" ", "") == "Calificacion2" || myString.replace(" ", "") == "Calificacion3" || myString.replace(" ", "") == "Calificacion4" || myString.replace(" ", "") == "Calificacion5") {
                        cuerpo = `${cuerpo} <a class="social" onclick="ButtonClick_Test('${myString}')">                                                
                                                <img class="img-fluid" src="${bluemixHost}/img/${myString.replace(" ", "")}.png">
                                            </a>`;
                    } else {
                        cuerpo = `${cuerpo} 
									<div class="col-12">
										<button class="btn btn-primary btn-sm" type="button" onclick="ButtonClick_Test('${myString}')">
											${myString}
										</button>
									</div>`;
                    }
                }
            } else {
                if (contador % 2 === 0) {
                    if (myString.replace(" ", "") == "Calificacion1" || myString.replace(" ", "") == "Calificacion2" || myString.replace(" ", "") == "Calificacion3" || myString.replace(" ", "") == "Calificacion4" || myString.replace(" ", "") == "Calificacion5") {
                        cuerpo = `${cuerpo} <a class="social" onclick="ButtonClick_Test('${myString}')">                                                
                                                <img class="img-fluid" src="${bluemixHost}/img/${myString.replace(" ", "")}.png">
                                            </a>`;
                    } else {
                        cuerpo = `${cuerpo} 
									<div class="col-12">
										<button class="btn btn-primary btn-sm" type="button" onclick="ButtonClick_Test('${myString}')">
											${myString}
										</button>
									</div>`;
                    }
                } else {
                    if (myString.replace(" ", "") == "Calificacion1" || myString.replace(" ", "") == "Calificacion2" || myString.replace(" ", "") == "Calificacion3" || myString.replace(" ", "") == "Calificacion4" || myString.replace(" ", "") == "Calificacion5") {
                        cuerpo = `${cuerpo} <a class="social" onclick="ButtonClick_Test('${myString}')">                                                
                                                <img class="img-fluid" src="${bluemixHost}/img/${myString.replace(" ", "")}.png">
                                            </a>`;
                    } else {
                        cuerpo = `${cuerpo} 
									<div class="col-12">
										<button class="btn btn-primary btn-sm" type="button" onclick="ButtonClick_Test('${myString}')">
											${myString}
										</button>
									</div>`;
                    }
                }

            }
            contador = contador + 1;
        }
    });

    return cuerpo;
}

function botonLink(texto) {

    let buttons = texto.split("((boton link: ");
    let textbtn = '';

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].indexOf("))") !== -1) {
            let url = buttons[i].split("))");
            let btns = url[0].split(";");
            textbtn += buttons[0];

            textbtn += `
                <div class="container-buttons text-center">
                    <div class="row">
                        <div class="col-12">
                            <a class="btn btn-primary btn-link" type="button" href="${btns[1]}" target="_blank">
                                ${btns[0]}
                            </a>
                        </div>
                    </div>
                </div>`;

            textbtn += url[1];
        }
    }
    texto = textbtn;
    return texto;
}

function botonesSeleccion(texto) {

    let buttons = texto.split("((botones seleccion: ");
    let textbtn = '';

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].indexOf("))") !== -1) {
            let url = buttons[i].split("))");
            let btns = url[0].split(";");
            textbtn += buttons[0];

            for (let j = 0; j < btns.length; j++) {
                textbtn += `
                <div class="container-buttons text-center">
                    <div class="row">
                        <div class="col-12">
                            <button class="btn btn-primary btn-sm" type="button" onclick="ButtonClick_Test('${btns[j]}')">
                                ${btns[j]}
                            </button>
                        </div>
                    </div>
                </div>`;
            }

            textbtn += url[1];
        }
    }
    texto = textbtn;
    return texto;
}

function Enlace(texto) {
    var enlace = texto.split("((boton enlace: ")
    for (var i = 0; i < enlace.length; i++) {
        if (enlace[i].indexOf(",htt") !== -1) {
            if (enlace[i].split("))").length > 3) {
                texto = texto + '<a href="' + enlace[i].split("))")[0].split(",")[1] + '" target="_blank">' + enlace[i].split("))")[0].split(",")[0] + '</a>' +
                    enlace[i].split("))")[1] + '))' + enlace[i].split("))")[2]
            } else {
                texto = texto + '<a href="' + enlace[i].split("))")[0].split(",")[1] + '" target="_blank">' + enlace[i].split("))")[0].split(",")[0] + '</a>' +
                    enlace[i].split("))")[1]
            }
        } else {
            texto = enlace[i]
        }
    }
    return texto;
}

function Video(texto) {
    var video = texto.split("((video: ")
    for (var i = 1; i < video.length; i++) {

        if (video[i].indexOf("))") !== -1 && i < video.length) {
            var url = video[i].split("))")

            //video[0] = video[0] + '<iframe width="100%" height="auto" src='+'"'+url[0]+'"'+'frameborder="0" allowfullscreen></iframe>' + '<br>'+url[1]

            video[0] = `${video[0]}<div class="embed-responsive embed-responsive-16by9">
                          <iframe class="embed-responsive-item" src="${url[0]}" allowfullscreen></iframe>
                        </div>${url[1]}`
        } else {
            var url = video[i].split("))")
            //video[0] = video[0] + '<iframe width="100%" height="auto" src='+'"'+url[0]+'"'+'frameborder="0" allowfullscreen></iframe>' + '<br>'

            video[0] = `${video[0]}<div class="embed-responsive embed-responsive-16by9">
                          <iframe class="embed-responsive-item" src="${url[0]}" allowfullscreen></iframe>
                        </div>`
        }
    }
    texto = video[0]
    return texto;
}

function imagenEnlace(texto) {
    var imagenEnlace = texto.split("((boton imagen enlace: ");

    for (var i = 1; i < imagenEnlace.length; i++) {
        countModalsViva++;

        if (imagenEnlace[i].indexOf("))") !== -1 && i < imagenEnlace.length) {
            var textoimagen = imagenEnlace[i].split("))");
            var parametros = textoimagen[0].split(",");
            var textoFinal = "";
            var modalDiv = "";

            if (typeof textoimagen[1] !== 'undefined') {
                textoFinal = textoimagen[1];
            }

            imagenEnlace[0] = imagenEnlace[0] + `
            <a href="${parametros[1]}" target="_blank">${parametros[0]}</a>
            <div class="imagenEnlace">
                <a style="cursor: pointer;" data-toggle="modal" data-target="#modalImageEnlace${countModalsViva}">
                    <img class="img-fluid" src="${parametros[2]}" />
                </a>
            </div>${textoFinal}`;

            modalDiv = `<div id="modalImageEnlace${countModalsViva}" class="modal" tabindex="-1" role="dialog" aria-labelledby="modalImageEnlace${countModalsViva}">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${parametros[2].replace(" ", "")}" class="img-responsive" style="width: 100%" />
                                </div>
                            </div>
                            </div>
                        </div>`;

            $("#modalsViva").append(modalDiv);

            texto = imagenEnlace[0];
        } else {
            var textoimagen = imagenEnlace[i].split("))");
            var parametros = textoimagen[0].split(",");
            var modalDiv = "";
            texto = texto;
            modalDiv = `<div class="imagenEnlace">
                            <a style="cursor: pointer;" data-toggle="modal" data-target="#modalImageEnlace${i}">
                                <img class="img-fluid" src="${parametros[2]}" />
                            </a>
                            <a class="btn btn-lg btn-block" href="${parametros[1]}" target="_blank">${parametros[0]}</a>
                        </div>${textoFinal}

                        <div id="modalImageEnlace${countModalsViva}" class="modal" tabindex="-1" role="dialog" aria-labelledby="modalImageEnlace${countModalsViva}">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${parametros[2].replace(" ", "")}" class="img-responsive" style="width: 100%" />
                                </div>
                            </div>
                            </div>
                        </div>`;

            $("#modalsViva").append(modalDiv);
        }
    }

    return texto;
}

function ModalImage(texto) {
    var imagen = texto.split("((imagen modal: ");

    for (var i = 1; i < imagen.length; i++) {
        countModalsViva++;
        if (imagen[i].indexOf("))") !== -1 && i < imagen.length) {
            var textomodal = imagen[i].split("))");
            var url = textomodal[0].split(",");
            var textoFinal = "";
            var modalDiv = "";

            if (typeof textomodal[1] !== 'undefined') {
                textoFinal = textomodal[1];
            }

            imagen[0] = imagen[0] + `<a style="cursor: pointer;" data-toggle="modal" data-target="#modalImage${countModalsViva}">${url[0]}</a> ${textoFinal}`;

            modalDiv = `<div id="modalImage${countModalsViva}" class="modal" tabindex="-1" role="dialog" aria-labelledby="modalImage${countModalsViva}">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${url[1].replace(" ", "")}" class="img-responsive" style="width: 100%" />
                                </div>
                            </div>
                            </div>
                        </div>`;

            $("#modalsViva").append(modalDiv);

            texto = imagen[0];
        } else {
            var textomodal = imagen[i].split("))");
            var url = textomodal[0].split(",");
            var modalDiv = "";
            texto = texto + `<a style="cursor: pointer;" data-toggle="modal" data-target="#modalImage${i}">${url[0]}</a>`;

            modalDiv = `<div id="modalImage${i}" class="modal" tabindex="-1" role="dialog" aria-labelledby="modalImage${i}">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${url[1].replace(" ", "")}" class="img-responsive" style="width: 100%" />
                                </div>
                            </div>
                            </div>
                        </div>`;

            $("#modalsViva").append(modalDiv);
        }
    }

    return texto;
}

function loadCaptcha() {
    captchaContainer = grecaptcha.render('captcha_container', {
        'sitekey': '6LenbngUAAAAAGJ7lMU-JP5q_m1rYZfgB0VKFnRQ',
        'callback': function (response) {
            $.ajax({
                url: 'validateCaptcha',
                type: 'post',
                dataType: 'json',
                data: {
                    "g-recaptcha-response": response
                },
                success: function (response) {
                    var context = null;

                    if (response.responseCode == 0 && response.responseDesc == "Success") {
                        var latestResponse = ApiChatVivaAir.getResponsePayload();
                        if (latestResponse) {
                            context = latestResponse.context;
                        }

                        context['respuestaCaptcha'] = "ok";
                        context['activarInput'] = true;

                    } else {
                        context['respuestaCaptcha'] = "fail";
                        context['activarInput'] = false;
                    }

                    ApiChatVivaAir.simpleRequest(null, context, function (res) {
                        res = JSON.parse(res);
                        console.log('Response: ', res);
                        if (res.context.activarInput) {
                            $('div.pane-action').removeClass('d-none');
                            $('input#textInput').addClass('fadeIn');
                        }
                    });

                },
                error: function (response) {
                    console.log(response);
                }
            });
        }
    });
}

function surveyStars(texto) {

    var encuesta = texto.split("((encuesta estrella: ");

    for (var i = 1; i < encuesta.length; i++) {

        if (encuesta[i].indexOf("))") !== -1 && i < encuesta.length) {
            var textoencuesta = encuesta[i].split("))");
            var options = textoencuesta[0].split(";");
            var survey = "";
            var cont = options.length;

            for (let index = options.length - 1; index >= 0; index--) {
                let option = options[index];
                survey = `${survey} 
                <input class="rating-star star-${index + 1}" id="${option}" type="radio" name="star" onchange="enviarCalificacion('${option}')">
                <label class="rating-star star-${index + 1}" for="${option}" title="${option}"></label>`;
            }

            var textoFinal = "";

            if (typeof textoencuesta[1] !== 'undefined') {
                textoFinal = textoencuesta[1];
            }

            encuesta[0] = `${encuesta[0]} <div class="text-center">
                <div class="stars">
                    ${survey}
                </div>
            </div>${textoFinal}`;

            texto = encuesta[0];
        } else {
            var textoencuesta = encuesta[i].split("))");
            var options = textoencuesta[0].split(";");
            var survey = "";
            var cont = options.length;

            for (let index = options.length - 1; index >= 0; index--) {
                let option = options[index];
                survey = `${survey} 
                <input class="rating-star star-${index + 1}" id="${option}" type="radio" name="star" onchange="enviarCalificacion('${option}')">
                <label class="rating-star star-${index + 1}" for="${option}" title="${option}"></label>`;
            }

            texto = `${texto} <div class="text-center">
                <div class="stars">
                    ${survey}
                </div>
            </div>${textoFinal}`;
        }
    }

    return texto;
}

function accordion(texto) {

    let accordion = texto.split("[[accordion: ");
    let temptext = '';

    for (let i = 0; i < accordion.length; i++) {
        if (accordion[i].indexOf("]]") !== -1) {
            let split = accordion[i].split("]]");
            let acc = split[0].split(';');
            temptext += accordion[0];

            for (let j = 0; j < acc.length; j++) {
                temptext += `<div id="accordionViva${countAccordion}" class="accordion">
                                <div id="header${countAccordion}" class="card-header collapsed" data-toggle="collapse" href="#collapse${countAccordion}" onclick="sendRequest('${acc[j]}', '${countAccordion}')">
                                    ${acc[j]}
                                </div>
                                <div id="collapse${countAccordion}" class="card-body collapse" data-parent="#accordionViva${countAccordion}">
                                </div>
                            </div> `;
                countAccordion++;
            }

            temptext += split[1];
        }
    }

    texto = temptext;
    return texto;
}

function tabs(texto) {

    var tabs = texto.split("((tabs: ");
    let temptext = '';

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].indexOf("))") !== -1) {
            let split = tabs[i].split("))");
            let tab = split[0].split(';');

            temptext += `<ul class="nav nav-pills nav-justified">`;

            for (let j = 0; j < tab.length; j++) {
                if (j == 0) {
                    textsend = tab[j];
                }
                let tabcontentid = 'tabcontent-' + tab[j].replace(/\s+/g, '-').toLowerCase();
                temptext += `<li class="nav-item">
                                <a href="#" data-target="#${tabcontentid}" data-toggle="tab" class="nav-link" onclick="sendRequestTab('${tab[j]}', '${tabcontentid}')">${tab[j]}</a>
                            </li>`;
            }

            temptext += `</ul>
                        <div id="tabsContent" class="tab-content">`;

            for (let j = 0; j < tab.length; j++) {
                let tabcontentid = 'tabcontent-' + tab[j].replace(/\s+/g, '-').toLowerCase();
                temptext += `
                    <div id="${tabcontentid}" class="tab-pane fade"></div>`;
            }

            temptext += `</div>`;

            countAccordion++;
            temptext += split[1];
        }
    }
    texto = temptext;
    return texto;
}

function sendRequest(text, id) {
    let header = $("#header" + id);

    if (text && header.hasClass("collapsed")) {
        $('#collapse' + id).html('');
        $('#chat-typing').removeClass('invisible');

        var context;
        var latestResponse = ApiChatVivaAir.getResponsePayload();
        if (latestResponse) {
            context = latestResponse.context;
        }
        ApiChatVivaAir.simpleRequest(text, context, function (res) {
            res = JSON.parse(res);
            console.log(res);
            $('#chat-typing').addClass('invisible');
            let html = '';
            let captcha = false;
            res.output.text.map((text) => {
                html += ArmarBotones(text, null);
                if (text.includes('((captcha:')) {
                    captcha = true;
                }
            });

            $("#collapse" + id).html(html);
            if (captcha) {
                loadCaptcha("collapse" + id);
            }
        });
    }
}

function sendRequestTab(text, tabid) {

    if (text) {
        $('#' + tabid).html('');
        $('#chat-typing').removeClass('invisible');

        var context;
        var latestResponse = ApiChatVivaAir.getResponsePayload();
        if (latestResponse) {
            context = latestResponse.context;
        }
        ApiChatVivaAir.simpleRequest(text, context, function (res) {
            res = JSON.parse(res);
            $('#chat-typing').addClass('invisible');
            let html = '';
            res.output.text.map((text) => {
                html += ArmarBotones(text, null);
            });

            $("#" + tabid).html(html);
        });
    }
}

function sendRequestCaptcha(text, id, context) {

    console.log('sendRequestCaptcha: ', text, id, context);

    $('#' + id).html('');
    $('#chat-typing').removeClass('invisible');

    ApiChatVivaAir.simpleRequest(text, context, function (res) {
        res = JSON.parse(res);
        console.log('Response captcha: ', res);
        $('#chat-typing').addClass('invisible');

        let html = '';
        let captcha = false;
        res.output.text.map((text) => {
            html += ArmarBotones(text, null);
            if (text.includes('((captcha:')) {
                captcha = true;
            }
        });

        $("#" + id).html(html);
        if (captcha) {
            loadCaptcha("collapse" + id);
        }
    });
}

function enviarCalificacion(calificacion) {
    $("div.stars").fadeOut(1000, function () {
        $(this).remove();
    });
    if (calificacion != null && calificacion != "") {
        document.querySelector('#textInput').value = calificacion;
        ConversationPanel.pasoMensaje(document.querySelector('#textInput'));
    }
}