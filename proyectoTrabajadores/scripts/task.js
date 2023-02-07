/**
 * Constructor function of a task
 * @param {String} text Text you want to put in
 */
function Task(text){
    let date = new Date();
    let currentDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();//Obtenemos las horas, minutos y segundos y los guardamos en un string
    this.text=text;
    this.date=currentDate;
}
/**
 * Funcion que añade una tarea cada vez que presione el botón, también comprueba si está dentro o no
 * @param {Event} e 
 */
function addTask(e) {
    e.preventDefault();
    /**
     * Primero, checkeamos si hay alguna tarea anteriormente
     */
    let text = document.getElementById("newTask").value;
    if (text.length > 0) {
        if (!searchJSON("tasks")) {
            /**
             * Si no la hay, creamos el JSON con el nombre tasks
             */

           
            const structure = [new Task(text)];
            localStorage.setItem("tasks", JSON.stringify(structure));
        } else {
            let tasks = JSON.parse(localStorage.getItem("tasks"));
            /**
             * Vamos a comprobar que la tarea introducida no está ya en el JSON
             * Para ello, sacamos el texto y hacemos un find, si coincide con el introducido nos dará true
             */
            if (tasks.find(e => e.text == text)) {
                alert("This task is repeated!");
            } else {
                tasks.push(new Task(text));
                localStorage.setItem("tasks", JSON.stringify(tasks));//Añadimos el JSON modificado 
                console.log(localStorage.getItem("tasks"));

            }

        }
        location.reload();//Recargamos la página
    } else {
        alert("You must write your task first!");
    }

}
/**
 * Funcion que va sumando el total de contadores que tienen las tareas, aunque estén borradas
 */
function addCountTask() {
    document.getElementById("totalTask").style.display = "block";
    let element = document.getElementById("count");
    let count = JSON.parse(localStorage.getItem("tasks")).length;
    element.innerHTML = count;
}
/**
 * Funcion que muestra y crea los elementos que contienen las tareas
 */
function showTasks(tasks) {
    addCountTask();
    let list = document.getElementById("taskList");
    for (let i = 0; i < tasks.length; i++) {
        let li = document.createElement("li"); //Creamos un elemento LI
        li.innerHTML = tasks[i].text + "   -> " + tasks[i].date;
        let checkBox = document.createElement("input");
        checkBox.setAttribute("class", "checkbox");
        checkBox.setAttribute("type", "checkbox");
        li.appendChild(checkBox);
        list.appendChild(li);
    }
}
/**
 * 
 * @param {string} text 
 * @returns Posicion en la que se encuentra el objeto en cada uno de los arrays
 */
function findTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let position = null;
    for (let i in tasks) {
        if (text === tasks[i].text) {
            position = i;
        }
    }
    return position;
}

/**
 * Funcion que borra la posición del elemento pasado por el array
 */
function deleteTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let position = findTask(text);
    tasks.splice(position, 1); //Con splice, nos elimina del array el objeto en la posicion que queramos y además reinicia los indices de los otros
    localStorage.setItem("tasks", JSON.stringify(tasks)); //Devolvemos el objeto con los datos eliminados
}

function updateDeletedTasks(e) {
    if (window.confirm("Are you sure you want to delete this task?")) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        let fatherText = e.target.parentElement.innerHTML.split("-&gt")[0].trimEnd(); //Con esto, obtenemos el texto directamente del padre
        let position = findTask(fatherText); //Nos devuelve la posición en la que se encuentra el texto
        if (!searchJSON("finishedTask")) {//Buscamos si está creado 
            //Si no está creado, significa que nos devuelve false, por tanto queremos lo contrario
            //Creamos el objeto donde estarían las tareas terminadas
            const structure = [new Task(tasks[position].text) ]
            localStorage.setItem("finishedTask", JSON.stringify(structure));
        } else { //Si encuentra el JSON, simplemente tendremos que actualizar el objeto con los datos nuevos
            let finishedTasks = JSON.parse(localStorage.getItem("finishedTask")); //Obtenemos el JSON
            finishedTasks.push(new Task(tasks[position].text));
            localStorage.setItem("finishedTask", JSON.stringify(finishedTasks));
        }
        /**
         * Una vez comprobado que se han añadido los datos al otro JSON, los borramos llamando a la funcion deleteTask
         */
        deleteTask(fatherText);
        location.reload();
    }
}
/**
 * Esto siempre se ejecuta cuando haya alguna tarea
 * Basicamente añade los eventos a las tareas además dellamar a la funcion de mostrarlas
 */

if (searchJSON("tasks")&&document.getElementById("newTask").value=="") {
    showTasks(JSON.parse(localStorage.getItem("tasks")));
    let list = document.querySelector("ul");
    list.addEventListener("mouseover", markTask, false);
    list.addEventListener("mouseout", unmarkTask, false);
    let checkBoxes = document.querySelectorAll(".checkbox");
    for (let i of checkBoxes) {
        i.addEventListener("click", updateDeletedTasks);
    }
}

/**
 * Crea una lista con las tareas terminadas
 */
if (searchJSON("finishedTask")) {
    let delTasks = document.getElementById("deletedTasks");
    delTasks.style.display = "block";
    let delList = document.getElementById("deletedList");
    let deletedTasks = JSON.parse(localStorage.getItem("finishedTask"));
    for (let i = 0; i < deletedTasks.length; i++) {
        let li = document.createElement("li"); //Creamos un elemento LI
        li.innerHTML = deletedTasks[i].text;
        delList.appendChild(li);
    }
}
/**
   * Funcion que nos devuelve true si el JSON existe en el localStorage
   * @param {string} string JSON key name
   */
function searchJSON(string) {
    return localStorage.getItem(string) !== null;
}
/**
 * Filter no esta terminada, no me sale correctamente asi que la comento directamente
 */
// function filterText(e) {

//     if (!searchJSON("task")) {
//         let tasklist=document.getElementsByTagName("li");
//         let tasks = JSON.parse(localStorage.getItem("tasks"));
//         console.log(tasks.filter(element => element.text.includes(e.target.value.toLowerCase())))
//         let filter=tasks.filter(element => element.text.includes(e.target.value.toLowerCase()));
//         for(let i = 0; i<tasklist.length; i++){
//             tasklist[i].style.display="none";
//         }
//         showTasks(filter);
//     }
// }
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
// document.getElementById("newTask").addEventListener("keydown", filterText,false);
document.getElementById("addTask").addEventListener("click", addTask, false);
