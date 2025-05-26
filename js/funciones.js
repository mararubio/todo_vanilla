const contenedorTareas =  document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputText = document.querySelector('form input[type="text"]');

//carga inicial de los datos
fetch("https://api-todo-jlo1.onrender.com/tareas")
.then(respuesta => respuesta.json())
.then(tareas => {
     tareas.forEach( ({id,tarea,terminada}) => {
          new Tarea(id,tarea,terminada,contenedorTareas);
     });
});

formulario.addEventListener("submit", evento =>{
    evento.preventDefault();

   if(inputText.value.trim() != ""){

          let tarea = inputText.value.trim();

          fetch("https://api-todo-jlo1.onrender.com/tareas/nueva", {
               method : "POST",
               body : JSON.stringify({tarea}),
               headers : {
                    "Content-type" : "application/json"
               }
          })
          .then(respuesta => respuesta.json())
          .then(({id,error}) => {
               if(!error){
                    new Tarea(id,tarea,false,contenedorTareas);

                     return inputText.value = "";
               }
               console.log("error");
          });
     }
});