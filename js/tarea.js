class Tarea{
    constructor(id,texto,estado,contenedor){ //número,string,boolean,DOM
        this.id = id;
        this.texto = texto;
        this.DOM = null;
        this.editando = false;

        this.crearDOM(estado,contenedor);
    }  

    crearDOM(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        //texto tarea
        let textoTarea = document.createElement("h2");
        textoTarea.innerText = this.texto;
        textoTarea.classList.add("visible");

        //editor tarea
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type","text");
        editorTarea.value = this.texto;

        //boton editar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click", () => this.actualizarTexto());

        //boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click", () => this.borrarTarea());

        //boton estado
        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${ estado ? "terminada" : ""}`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.actualizarEstado()
            .then(() => botonEstado.classList.toggle("terminada"))
            .catch(()=> console.log("error actualizando estado"))
        })

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    borrarTarea(){
        fetch("https://api-todo-jlo1.onrender.com/tareas/borrar/" + this.id, {
            method : "DELETE"
        })
        .then(({status}) => {
                if(status == 204){
                    return this.DOM.remove();  
                }
                console.log("error eliminando la tarea")
        });     
    }
    actualizarEstado(){
        return new Promise((ok,ko) => {
          fetch("https://api-todo-jlo1.onrender.com/tareas/actualizar/estado/" + this.id, {
            method : "PUT"
          })
          .then(({status}) => {
                if(status == 204){
                    return ok();
                }
                ko();
            });
        });
    }
    async actualizarTexto(){
        if(this.editando){

            let tareaTemporal = this.DOM.children[1].value.trim();

            if(tareaTemporal != "" && tareaTemporal != this.texto){
                let {status} = await fetch("https://api-todo-jlo1.onrender.com/tareas/actualizar/texto/" + this.id, {
                    method : "PUT",
                    body :  JSON.stringify({tarea : tareaTemporal}),
                    headers : {
                        "Content-type" : "application/json"
                    }
                });
                if(status == 204){
                    this.texto = tareaTemporal;
                }else{
                    console.log("error actualizando el texto, informar al usuario")
                }
            }

            //quitar clase visible a editorTarea
            this.DOM.children[1].classList.remove("visible");
            //actualizar el innerText de textoTarea al ultimo this.texto
            this.DOM.children[0].innerText = this.texto;
            //añadir classe visible atextoTarea this.DOM.children[0].innerText = this.texto;
            this.DOM.children[0].classList.add("visible");
            //cambiar el texto del botonEditar
            this.DOM.children[2].innerText = "editar";
        }else{
            //quitar clase VISIBLE a textoTarea
            this.DOM.children[0].classList.remove("visible");
            //actualizar el value de editorTexto al último this.texto
            this.DOM.children[1].value = this.texto;
            //añadir clase visible a editorTexto
            this.DOM.children[1].classList.add("visible");
            //cambiar el texto de botonEditar
            this.DOM.children[2].innerText = "guardar";
        }
        this.editando = !this.editando;
    }
}