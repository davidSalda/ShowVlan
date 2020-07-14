const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contactos tbody'),
      inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    formularioContactos.addEventListener('submit', leerFormulario);

    if(listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();
}

function leerFormulario(e) {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if(nombre  === '' || empresa === '' || telefono === ''){
        mostrarNotificacion('Todos los Campos son obligatorios', 'error');

        //mostrarNotificacion('Contacto Creado Correctamente', 'exito');

    } else {
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        //console.log(...infoContacto);

        if(accion === 'crear'){
            insertarBD(infoContacto); 
        } else {
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

function insertarBD(datos) {


    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);


    xhr.onload = function() {
        if(this.status === 200) {
            console.log(JSON.parse(xhr.responseText) );

            const respuesta = JSON.parse( xhr.responseText);

            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            const contenedorAcciones = document.createElement('td');


            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');


            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            contenedorAcciones.appendChild(btnEditar);

            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            contenedorAcciones.appendChild(btnEliminar);


            nuevoContacto.appendChild(contenedorAcciones);

            listadoContactos.appendChild(nuevoContacto);

            document.querySelector('form').reset();


            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');


            numeroContactos();


        }
    }

    xhr.send(datos)
}

function actualizarRegistro(datos) {
    
    const xhr = new XMLHttpRequest();


    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);


    xhr.onload = function() {
        if(this.status === 200) { 
            const respuesta = JSON.parse(xhr.responseText);

            if(respuesta.respuesta === 'correcto'){

                mostrarNotificacion('Contacto editado Correctamente', 'correcto');
            } else{
                mostrarNotificacion('Hubo un error', 'error');
            }

            setTimeout(() => {
                window.location.href = 'index.php';
            }, 4000);
        }
    }

    xhr.send(datos);
}

function eliminarContacto(e) {
    if(e.target.parentElement.classList.contains('btn-borrar') ) {
        const id = e.target.parentElement.getAttribute('data-id');

        //console.log(id);

        const respuesta = confirm('¿Estas seguro (a)?');

        if(respuesta) {
            const xhr = new XMLHttpRequest();


            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            xhr.onload = function() {
                if(this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta == 'correcto') {

                        console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();

                        mostrarNotificacion('Contacto Eliminado', 'correcto');


                        numeroContactos();

                    } else {
                        mostrarNotificacion('Hubo un error', 'error');
                    }
                }
            }
         

            xhr.send();
        }
    }
}

function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');           
            setTimeout(() =>{
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}

function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i");
          registros = document.querySelectorAll('tbody tr');
          
          
          registros.forEach(registro => {
              registro.style.display = 'none';

              
              if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1){
                registro.style.display = 'table-row';

              } 
              numeroContactos();
          })
}


function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });

    //console.log(total);

    contenedorNumero.textContent = total;

}

//374  http://localhost/AgendaPHP/