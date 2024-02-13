const inpAgregarImagen = document.getElementById('inpAgregarImagen');
const spanNingun = document.getElementById('spanNingun');

const btnAgregar = document.getElementById('btnAgregar');
const inpAgregarNombre = document.getElementById('inpAgregarNombre');
const inpAgregarCategoria = document.getElementById('inpAgregarCategoria');
const inpAgregarPrecio = document.getElementById('inpAgregarPrecio');

const btnsEditar = document.querySelectorAll('.btnEditar');
const btnsConfirmar = document.querySelectorAll('.btnConfirmar');
const btnsEliminar = document.querySelectorAll('.btnEliminar');
const filas = document.querySelectorAll('.fila');

const inpsCambiarImagen = document.querySelectorAll('.inpCambiarImagen');

inpsCambiarImagen.forEach(input =>{
    input.addEventListener('change', cambiarNombreArchivo2);
});

btnsEditar.forEach(boton =>{
    boton.addEventListener('click', editar);
});

btnsConfirmar.forEach(boton =>{
    boton.addEventListener('click', confirmar);
});

btnAgregar.addEventListener('click', agregarProducto);
inpAgregarImagen.addEventListener('change', cambiarNombreArchivo);

function cambiarNombreArchivo(){
    let nombreArchivo = inpAgregarImagen.files[0].name;

    spanNingun.textContent = nombreArchivo;
    spanNingun.style.Color = '#667077';
}

function cambiarNombreArchivo2(e){
    const id = e.currentTarget.id;

    const spanCambiarNingun = document.getElementById(`${id}span`)

    let nombreArchivo = e.currentTarget.files[0].name;

    spanCambiarNingun.textContent = nombreArchivo;
    spanCambiarNingun.style.Color = '#667077';
}

function normalizar(id){
    filas.forEach(fila =>{
        if(fila.id !== `${id}fila`){
            fila.style.backgroundColor = '#f2efef';
        }
    });

    btnsEliminar.forEach(boton =>{
        boton.removeAttribute('disabled')
        boton.classList.replace('btnEliminarDisabled', 'btnEliminar');
        boton.style.cursor = 'pointer';
    });

    btnsEditar.forEach(boton =>{
        if(boton.id !== id){
            boton.removeAttribute('disabled')
            boton.classList.replace('btnEditarDisabled', 'btnEditar');
            boton.style.cursor = 'pointer';
        }
    });

    let botonConfirmar;
    btnsConfirmar.forEach(boton =>{
        if(boton.id === id){
            botonConfirmar = boton;
            boton.style.transform ='translateY(0)';
            
            setTimeout(function() {
                boton.style.display='none';
            }, 300);
        }
    });

    btnsEditar.forEach(boton =>{
        if(boton.id === id){
            boton.style.display='block';
            setTimeout(function() {
                boton.style.transform ='translateY(0)';
            }, 10);
        }
    });

    setTimeout(function() {
        const fila = document.getElementById(`${id}fila`);
        fila.style.zIndex = 3;
        botonConfirmar.style.zIndex = 4;
    }, 300);
    
    const elP = document.createElement('p')
    const elInp = document.getElementById(`${id}inp`);
    elP.textContent = elInp.value;
    elP.className = 'pFila';
    elP.id = `${id}p`;
    const padre = elInp.parentNode;
    padre.replaceChild(elP, elInp);

    const inputsFila = document.getElementsByClassName(`${id}inpfila`);
    [...inputsFila].forEach(input =>{
        input.classList.replace('inpFila', 'pFila');
        input.setAttribute('readonly', 'true');
    });

    const dvCambiar = document.getElementById(`${id}dvCambiar`);
    const dvImagen = document.getElementById(`${id}dvImagen`);

    dvImagen.style.display = 'flex';
    dvCambiar.style.display = 'none';
}

function editar(e){
    const id = e.currentTarget.id;

    filas.forEach(fila =>{
        if(fila.id !== `${id}fila`){
            fila.style.backgroundColor = '#c9cccf';
        }
    });

    btnsEliminar.forEach(boton =>{
        boton.setAttribute('disabled', 'true');
        boton.classList.replace('btnEliminar', 'btnEliminarDisabled');
        boton.style.cursor = 'default';
    });

    btnsEditar.forEach(boton =>{
        if(boton.id !== id){
            boton.setAttribute('disabled', 'true');
            boton.classList.replace('btnEditar', 'btnEditarDisabled');
            boton.style.cursor = 'default';
        }
    });

    btnsEditar.forEach(boton =>{
        if(boton.id === id){
            boton.style.transform ='translateY(70px)';
            setTimeout(function() {
                boton.style.display='none';
            }, 300);
            
        }
    });
    const fila = document.getElementById(`${id}fila`);

    fila.style.zIndex = 2;

    btnsConfirmar.forEach(boton =>{
        if(boton.id === id){
            boton.style.display='block';
            boton.style.zIndex = 3;
            setTimeout(function() {
                boton.style.transform ='translateY(70px)';
            }, 10);
            
        }
    });

    const elP = document.getElementById(`${id}p`)
    const elInp = document.createElement('input');
    elInp.type = 'text';
    elInp.value = elP.textContent;
    elInp.className = 'inpFila';
    elInp.id = `${id}inp`;
    const padre = elP.parentNode;
    padre.replaceChild(elInp, elP);

    const inputsFila = document.getElementsByClassName(`${id}inpfila`); //devuelve una conleccion HTML
    [...inputsFila].forEach(input =>{
        input.classList.replace('pFila', 'inpFila');
        input.removeAttribute('readonly');
    });
    //con el [...] lo convertimos en un array

    const dvCambiar = document.getElementById(`${id}dvCambiar`);
    const dvImagen = document.getElementById(`${id}dvImagen`);

    dvImagen.style.display = 'none';
    dvCambiar.style.display = 'flex';
}

function confirmar(e){
    const id = e.currentTarget.id;

    const nombre = document.getElementById(`${id}inp`).value;
    const categoria = document.getElementById(`${id}inpCategoria`).value;
    const precio = document.getElementById(`${id}inpPrecio`).value;
    const imagen = document.getElementById(`${id}inpCambiar`).files[0];
    
    editarProducto(id, nombre, categoria, precio, imagen);
}

function editarProducto(id, nombre, categoria, precio, imagen){
    //El form data es una especie de objeto que alverga información de tipo clave valor
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('categoria', categoria);
    formData.append('precio', precio);
    formData.append('imagen', imagen);

    console.log(id, nombre, categoria, precio, imagen);

    fetch(`/editarProducto`,{
        method: 'POST',
        body: formData
        }).then(response => response.json())
        .then(data => {
            if(data.status === 0){
                alert('Ya existe un producto con ese nombre, por favor elija otro.');
                document.getElementById(`${id}inp`).value = '';
            }else{
                normalizar(id);
                window.location.reload();
            }
            
        })
        .catch(error => console.error('Error al agregar el producto:', error));
}

/*function base64ToBlob(base64String) {
    const byteString = atob(base64String.split(',')[1]);
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([arrayBuffer], { type: mimeString });
}*/

function agregarProducto(){
    if(inpAgregarNombre.value === '' || inpAgregarCategoria.value === '' || inpAgregarPrecio.value === '' || inpAgregarImagen.files[0].name === ''){
        alert('Por favor, completa todos los campos.');
    }else{
        const nombre = inpAgregarNombre.value;
        const categoria = inpAgregarCategoria.value;
        const precio = inpAgregarPrecio.value;
        const archivo = inpAgregarImagen.files[0];

        const formData = new FormData();
        formData.append('imagen', archivo);
        formData.append('nombre', nombre);
        formData.append('categoria', categoria);
        formData.append('precio', precio);
        fetch(`/agregarProducto`,{
            method: 'POST',
            body: formData
            }).then(response => response.json())
            .then(data => {
                if(data.status === 0){
                    alert('Ya existe un producto con ese nombre, por favor elija otro.');
                    inpAgregarNombre.value = '';
                }else{
                    window.location.reload();
                }
                
            })
            .catch(error => console.error('Error al agregar el producto:', error));
    }
}