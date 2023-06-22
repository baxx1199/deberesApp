import Task from "./Task.js";
import RemainingDay from "./RemainingDay.js";
//define global constants and variables how the reference changes for entries and DOM elements that we do not want to change or will use multiple times
const task_name = document.getElementById("txtName"),
  initial_date = document.getElementById("pickerDateStart"),
  final_date = document.getElementById("pickerDateFinal"),
  task_description = document.getElementById("txtDescription"),
  task_id_code = document.getElementById("txtId"),
  modal_cont = document.getElementById("cont-modal");

let task_card_cont = document.getElementById("cont");

const btn_save = document.getElementById("btnSave"),
  btn_close_modal = document.getElementById("btn_close");

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
  } 
  console.log(btn_save.textContent)
    if(btn_save.textContent == "actualizar"){
      console.log("entro")
      task=tasks[task_id_code.value]

      task.task_name = task_name.value;
      task.initial_date = initial_date.value;
      task.final_date = final_date.value;
      task.description_task = task_description.value;
      task.id_task = task_id_code.value;


      tasks[task_id_code.value] = task

      
    }

    if(btn_save.textContent == "Guardar"){
      console.log("entro a guardar")
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
      send_counterID_to_storage();
    }

    
    send_task_to_storage();
    clean_inputs();
    create_card();
    btn_save.innerText= "Guardar";
  
}

function format_date(date) {
  let final_date_cut = date.split("T");
  let date_to_string = final_date_cut[0] + " " + final_date_cut[1] + " hrs";

  return date_to_string;
}

function clean_inputs() {
  task_name.value = "";
  initial_date.value = "";
  final_date.value = "";
  task_description.value = "";
}

/* This method creates all task cards that are in storage */
function create_card() {
  get_task_From_storage(); //First you get the tasks that are in the storage and define a local varibale will container the html in string format and remaining time of every task
  let string_card = "",
    remaining;
  if (tasks.length == 0) {
    string_card = `<h2>No hay tareas pendientes<h2>`;
  }
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
                <button class="op op_edit" data-index-task="${task.id_task}">Editar</button>


                <button class="op op_delete" data-index-task="${
                  task.id_task
                }"  >Eliminar</button>
                <button class="op op_details" data-index-task="${
                  task.id_task
                }"  >Ver</button>
            </div>
        </div>`;
  });

  task_card_cont.innerHTML = string_card;
  assigment_delete_event(); //Once the cards are created, all buttons must be assigned their respective event. this mapping must be done after the cards created because some properties are initialized during creation.
  assigment_details_event();
  assigment_edit_event();
}

/* 
    This method will assign a event lisener to all buttons
*/
function assigment_delete_event() {
  document.querySelectorAll(".op_delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      delete_task(btn.dataset.indexTask);
    });
  });
}

function assigment_details_event() {
  document.querySelectorAll(".op_details").forEach((btn) => {
    btn.addEventListener("click", () => {
      see_details_task(btn.dataset.indexTask);
    });
  });
}

function assigment_edit_event() {
  document.querySelectorAll(".op_edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      update_task(btn.dataset.indexTask);
    });
  });
}
/* this method eliminates a task from storage and return new array with remaining tasks
    This should receive a parameter that indicates the ID of the item to be deleted
*/
function delete_task(id_to_find) {
  let temp = tasks;
  let position = get_position_in_array(id_to_find);

  if (!temp.length) {
    alert("no hay tareas pendietes");
    return;
  }
  if (position == -1) {
    alert("tarea no encontrada");
    return;
  }

  temp.splice(position, 1);
  tasks = temp;
  send_task_to_storage();
  create_card();
}

function close_modal() {
  modal_cont.classList.remove("modal-open");
  console.log("cerrar")
}

/* 
  if the item is found return a number with the position of the element in the array
  but isn't found return -1
*/
function get_position_in_array(id) {
  let temp = tasks;
  let position = -1;
  if (temp.length) {
    temp.forEach((task) => {
      if (task.id_task == id) {
        position = temp.indexOf(task);
        return;
      }
    });
  }
  return position;
}
/* Method for updating or modifying the details of a task */

function update_task(id, ) {
    let position = get_position_in_array(id);
    let  task_to_edit = tasks[position];

    task_name.value = task_to_edit.task_name;
    initial_date.value = task_to_edit.initial_date;
    final_date.value = task_to_edit.final_date;
    task_description.value = task_to_edit.description_task;
    task_id_code.value = task_to_edit.id_task;

    btn_save.innerText = "actualizar";

}

/* This method opens a modal that displays all the details of the selected task */
function see_details_task(id) {
  let position = get_position_in_array(id);
  let string_modal = "";
  let task_for_modal, remaining;
  if (position == -1) {
    alert("tarea no encontrada");
    return;
  }

  task_for_modal = tasks[position];
  remaining = new RemainingDay(task_for_modal.final_date, new Date());
  string_modal = `
  <button class="btn_close" id="btn_close">X</button>
  <div class="modal_header">
      <h2>${task_for_modal.task_name}</h2>
      <small class="remaining" id="days_remaining_modal">${remaining.remaining_ToString()}</small>
  </div>
  <div class="cont-dates">

      <small class="date_label_modal start_date">Inicio de tarea: <span>${format_date(
        task_for_modal.initial_date
      )}</span></small>
      <small class="date_label_modal final_date">Final de la tarea: <span>${format_date(
        task_for_modal.final_date
      )}</span></small>
  </div>
  <div class="modal_group">
      <small>Grupo: <span class="group-name">proyecto 1</span>   </small>
  </div>
  <p class="description_modal">
    ${task_for_modal.description_task}
  </p>
  <small class="level">prioridad: <span class="level-tag level-tag-mid">medio</span> <span class="level-tag level-tag-low">baja</span> <span class="level-tag level-tag-high">alta</span></small>
  
  <div class="modal_tags">
      tags:
      <ul>
          <li>salud</li>
          <li>estudio</li>
          <li>juego</li>
      </ul>
  </div>
  `;

  document.getElementById("modal").innerHTML = string_modal;
  modal_cont.classList.add("modal-open");
  document.getElementById("btn_close").addEventListener("click", close_modal);
}

/* assigment of the events */
btn_save.addEventListener("click", save_task);
window.addEventListener("load", create_card);

