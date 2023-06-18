import Task from "./Taks.js"

//define global constants and variables how the reference changes for entries and DOM elements that we do not want to change or will use multiple times
const task_name = document.getElementById('txtName'),
    initial_date = document.getElementById('pickerDateStart'),
    final_date = document.getElementById('pickerDateFinal'),
    task_description = document.getElementById('txtDescription');

let task_card_cont = document.getElementById("cont")

const btn_save = document.getElementById('btnSave');

const myStorage = window.localStorage;
let counter = 0;

let tasks=[];
let task;

/* 
   1. Verificar que tareas existen en el almacenamiento

    2. traer  todas las tareas existentes

    agregar nueva tarea 

    enviar todas las tareas al almacenamiento, despues de agregar la nueva tarea


    elminar()
        paso 1 y 2 
        
*/



function sent_to_storage() {

    myStorage.setItem("tasks_storage", tasks)
}

function getFrom_storage() {
    let tempTask =myStorage.getItem("tasks_storage")
    JSON.st
    if(tempTask.isNull || tempTask.length==0){

    }
}

function validation_of_inputs(e) {
    e.preventDefault();

    if(task_name.value == ""){
        console.log(task_name.value)
        return false;
    }
    if(initial_date.value == ""){
        console.log(initial_date.value)
        return false;
    }
    if(final_date.value == ""){
        
        return false;
    }
    return true;
    
}

function save_task(e) {
    if(!validation_of_inputs(e)){
        console.log("error")
        return;
    }else{
        task=new Task(task_name.value,initial_date.value, final_date.value, task_description.value, counter);
        tasks.push(task)
        console.log("agregada con exito")
        counter++;

        clean_inputs();
        task.get_remaining()
        create_card()
        
    }



}

function clean_inputs() {
    task_name.value ="";
    initial_date.value="";
    final_date.value="";
    task_description.value="";
}

function create_card(task) {
    let string_card = ""
    
    tasks.forEach(task => {
        
        string_card+=` 
        <div class="card" id="card">
            <small class="remaining" id="days_remaining">${task.remaining_time}</small>
            <h3>${task.task_name}</h3>
            <small class="date_label start_date">Inicio: <span>${task.initial_date}hrs</span></small>
            <small class="date_label final_date">Final: <span>${task.final_date}hrs</span></small>
            <p>
                ${task.description_task}
            </p>
        </div>`;
        console.log(task.id_task)
    });

    task_card_cont.innerHTML = string_card
   
}





btn_save.addEventListener("click", save_task)