/**
 * Primero, vamos a comprobar si el usuario ha iniciado sesión
 */
const userform = document.getElementById("userForm");
if (localStorage.getItem("user") === null) {
    userform.style.display = "block";
    /**
     * 
     * @param {Event} e 
     */
    function validateForm(e) {
        e.preventDefault();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let email = document.getElementById("email").value;
        let dni = document.getElementById("dni").value;
        const validatePassword = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/; //Expresion para validar la contraseña
        const validateDni = /^[0-9]{8}[A-Z]$/i; //Expresion para validar el email
        if (dni.match(validateDni) && password.match(validatePassword)) { //Si los datos son correctos, entra
            const user = { //Construimos el objeto usuario con los datos introducidos
                username: username,
                password: password,
                email: email,
                dni: dni
            }
            localStorage.setItem("user", JSON.stringify(user)); //Añadimos el objeto en localstore con el nombre user en formato JSON
            location.reload(); //Recargamos la pagina para que desaparezca el formulario inmediatamente
        } else {
            alert("Algunos campos no están correctos");
            console.log(validateDni.test(dni));
            console.log(validatePassword.test(password));
        }
    }
    document.getElementById("validate").addEventListener("click", validateForm, false);
} else {
    document.getElementById("userContainer").style.display="block";
    document.getElementById("user").innerHTML=JSON.parse(localStorage.getItem("user")).username;
    userform.style.display = "none";
    document.getElementById("deleteUser").style.display="block";
}
function deleteUsers(){
    if(window.confirm("Are you sure you want to delete this user?")){
        if(window.confirm("All tasks will be removed too")){
            localStorage.clear();
            location.reload();
        }
    }
}
/**
 * Funcion que cambia los estilos cuando pasa el raton por encima a las tareas
 * @param {Event}
 * 
 */
function markTask(e) {
    e.target.style.color = "red";
    e.target.style.textDecoration = "line-through";
}
/**
 * Funcion que vuelve a poner los estilos de las tareas a su forma base al quitar el raton
 * @param {Event} e 
 */
function unmarkTask(e) {
    e.target.style.color = "#FFF";
    e.target.style.textDecoration = "none";
}
let deleteUser=document.getElementById("deleteUser");
deleteUser.addEventListener("click",deleteUsers,false);
deleteUser.addEventListener("mouseover",markTask,false);
deleteUser.addEventListener("mouseout",unmarkTask,false);

