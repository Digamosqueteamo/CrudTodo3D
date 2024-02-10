const pError = document.getElementById('pError');
const btnContinuar = document.getElementById('btnContinuar').addEventListener('click', continuar);
const inpUser = document.getElementById('inpUser');
const inpPassword = document.getElementById('inpPassword');
const noSlashEye = document.getElementById('noSlashEye');
const slashEye = document.getElementById('slashEye');

noSlashEye.addEventListener('click', () => {
    inpPassword.type = 'password';
    noSlashEye.style.display = 'none';
    slashEye.style.display = 'block';
});

slashEye.addEventListener('click', () => {
    inpPassword.type = 'text';
    slashEye.style.display = 'none';
    noSlashEye.style.display = 'block';
});

async function continuar(){
    const usuario = inpUser.value;
    const contraseña = inpPassword.value;
    let status;
    await fetch(`/confirmarUsuario`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({usuario: usuario, contraseña:contraseña})
    }).then(response => response.json())
    .then(data => {
        status = data.status;
    })
    .catch(error => console.error('Error al confirmar el usuario:', error));

    console.log(status);

    if(status === 1){
        window.location.href = '/crud';
    }else{
        pError.style.opacity = 1;
    }
}