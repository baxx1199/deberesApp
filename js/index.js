import Task from "./Taks.js";
import RemainingDay from "./RemainingDay.js";
//define global constants and variables how the reference changes for entries and DOM elements that we do not want to change or will use multiple times
const task_name = document.getElementById("txtName"),
  initial_date = document.getElementById("pickerDateStart"),
  final_date = document.getElementById("pickerDateFinal"),
  task_description = document.getElementById("txtDescription");

let task_card_cont = document.getElementById("cont");

const btn_save = document.getElementById("btnSave");

let btns_delete,
  btn_edit_taks = document.getElementById("btnEdit"),
  btn_details_taks = document.getElementById("btnDetails");

const myStorage = window.localStorage;
let counter = 0;

let tasks = [];
let task;

/* 
   1. Verificar que tareas existen en el almacenamiento

    2. traer  todas las tareas existentes

    agregar nueva tarea 

    enviar todas las tareas al almacenamiento, despues de agregar la nueva tarea


    elminar()
        paso 1 y 2 
        
*/

function send_task_to_storage() {
  myStorage.setItem("tasks_storage", JSON.stringify(tasks));
}

function get_task_From_storage() {
  let temp = JSON.parse(myStorage.getItem("tasks_storage"));

  if (temp == null) {
    return;
  }
  if (temp.length) {
    tasks = temp;
  }
}

function send_counterID_to_storage() {
  myStorage.setItem("tasksCode_id", counter);
}

function get_counterID_from_storage() {
  counter = Number(myStorage.getItem("tasksCode_id"));
}

function validation_of_inputs(e) {
  e.preventDefault();

  if (task_name.value == "") {
    console.log(task_name.value);
    return false;
  }
  if (initial_date.value == "") {
    console.log(initial_date.value);
    return false;
  }
  if (final_date.value == "") {
    return false;
  }
  return true;
}

function save_task(e) {
  if (!validation_of_inputs(e)) {
    console.log("error");
    return;
  } else {
    get_task_From_storage();
    get_counterID_from_storage();

    task = new Task(
      task_name.value,
      initial_date.value,
      final_date.value,
      task_description.value,
      counter
    );
    tasks.push(task);
    counter++;
    send_task_to_storage();
    send_counterID_to_storage();

    clean_inputs();

    create_card();
  }
}

function clean_inputs() {
  task_name.value = "";
  initial_date.value = "";
  final_date.value = "";
  task_description.value = "";
}
function pruebaJ(t) {
  console.log("ejecutando prueba");
  console.log(t);
}


/* This method creates all task cards that are in storage */
function create_card() {
    get_task_From_storage(); //First you get the tasks that are in the storage and define a local varibale will container the html in string format and remaining time of every task  
    let string_card = "", remaining;
  tasks.forEach((task) => {
    remaining = new RemainingDay(task.final_date, new Date()); //get the remaining time of the actually task
    string_card += ` 
        <div class="card" >
            <div class="card_header">
                <h3>${task.task_name}</h3>
                <small class="remaining" id="days_remaining">${remaining.remaining_ToString()}</small>
            </div>
                <small class="date_label start_date">Inicio: <span>${
                  task.initial_date
                }hrs</span></small>
                 <small class="date_label final_date">Final: <span>${
                   task.final_date
                 }hrs</span></small>
            <p>
                ${task.description_task}
            </p>
            <div class="options">
                <button class="op op_edit" >Editar</button>
                <button class="op op_delete" data-index-task="${
                  task.id_task
                }"  >Eliminar</button>
                <button class="op op_details"  >Ver</button>
            </div>
        </div>`;
  });

  task_card_cont.innerHTML = string_card;
  assigment_delete_event();//Once the cards are created, all buttons must be assigned their respective event. this mapping must be done after the cards created because some properties are initialized during creation.
}

/* 
    This method will assign a event lisener to all buttons
*/
function assigment_delete_event() {
  document.querySelectorAll(".op_delete").forEach(btn => {
    btn.addEventListener("click", () => {
      delete_task(btn.dataset.indexTask);
      
    });
  });
}
/* this method eliminates a task from storage and return new array with remaining tasks
    This should receive a parameter that indicates the ID of the item to be deleted
*/
function delete_task(id) {
  let temp = tasks;

  if (temp.length) {
    temp.forEach((task) => {
      if (task.id_task == id) {
        temp.splice(temp.indexOf(task), 1);
      }
    });
  }

  tasks = temp;
  send_task_to_storage();
  create_card();
}

/* Method for updating or modifying the details of a task */

function update_task(params) {
    
}


/* This method opens a modal that displays all the details of the selected task */
function see_details_task() {
    
}


/* assigment of the events */
btn_save.addEventListener("click", save_task);
window.addEventListener("load", create_card);
