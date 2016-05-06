"use strict";
let express = 	require("express"),
	app		= 	express(),
	puerto 	= 	process.env.PORT || 8081,
	bodyParser 	= require('body-parser');

//Para indicar que se envía y recibe información por medio de Json...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


let encuestas = [{
					id			: 1,
					pregunta    : "¿Qué lenguajes de programación conoce?",
					titulo      : "Lenguajes de programación",
					total       : 0,
					date		: "05/05/2016",
					opciones    : [
									{
										texto : "PHP",
										cantidad : 0,
										porcentaje : 0
									},
									{
										texto : "JavaScript",
										cantidad : 0,
										porcentaje : 0
									},
									{
										texto : "Java",
										cantidad : 0,
										porcentaje : 0
									},
									{
										texto : "C",
										cantidad : 0,
										porcentaje : 0
									}
								]
				}];


//Servicios REST...
app.get('/polls', (req, res) =>
{
	//Lista todas las encuestas almacenadas en el array...

	res.json(encuestas);
});

app.post('/createPoll', (req, res) =>
{
	//Guardar una nueva encuesta y responder el resultando en un JSON..
	encuestas.push(req.body);
	encuestas[encuestas.length-1]["id"]=encuestas.length;
	res.json(encuestas);

});

app.put('/updatePoll', (req, res) =>
{
	//Actualizar la encuesta y retornar el resultado en un JSON...
	let ind = buscarID(req.body.id);
	encuestas[ind]=req.body; 
	res.json(encuestas[ind]);
});

app.put('/votePOll', (req, res) =>
{
	//Primero saber si la encuesta existe...
	let ind 		= buscarID(req.param("id")),
	opcion		= Number(req.param("opcion")),
	status		= false;
	//console.log(ind, opcion);
	let total = encuestas[ind].total+=1;
	let cantidadxopcion = encuestas[ind].opciones[opcion - 1].cantidad+=1;


for (var i = 0; i < encuestas[ind].opciones.length; i++) 
{
	encuestas[ind].opciones[i].porcentaje=((encuestas[ind].opciones[i].cantidad/total)*100);
};
		
	//Se deberá actualizar la cantidad de respuesta de a encuesta...
	//Adicional se deberá agregar la propiedad procentaje...
	res.json({status : status, encuesta : ind >= 0 ? encuestas[ind] : []});
});

app.delete('/deletePoll/:id', (req, res) =>
{
	let ind = buscarID(req.param("id"));

//Recorrer todads las encuestas y elimina segun el ID
/*for (var i = 0; i < encuestas.length; i++) 
	{
	if (i === ind) 
		{
			console.log(encuestas[i]);
			encuestas.splice(ind,1)
			break;
		}
	}	
*/
//Eliminar la encuestas del Array...
	let eliminar_encuesta= encuestas.splice(ind,1);
	res.json(eliminar_encuesta);
});


app.get('/showPoll/:id', (req, res) =>
{
	var ind = buscarID(req.param("id"));
	var devuelve = {datos : ind >= 0 ? encuestas[ind] : "", status : ind >= 0 ? true : false};
	res.json(devuelve);
});


//Para cualquier url que no cumpla la condición...
app.get("*", function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
});

//Función que entrega la posición del array de
//de una encuesta dada el id de la misma...

let buscarID = id =>
{
	let ind = -1;
	for(let i = 0; i < encuestas.length; i++)
	{
		if(Number(encuestas[i].id) === Number(id))
		{
			ind = i;
			break;
		}
	}
	return ind;
};
app.listen(puerto);
console.log(`Express server iniciado en el ${puerto}`);
