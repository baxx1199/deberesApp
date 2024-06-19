import Task from "./Task.js";
import RemainingDay from "./RemainingDay.js";
import GroupTask from "./GroupTask.js";
//define global constants and variables how the reference changes for entries and DOM elements that we do not want to change or will use multiple times
const task_name = document.getElementById("txtName"),
  initial_date = document.getElementById("pickerDateStart"),
  final_date = document.getElementById("pickerDateFinal"),
  task_description = document.getElementById("txtDescription"),
  task_id_code = document.getElementById("txtId"),
  modal_cont = document.getElementById("cont-modal"),
  name_group_options_datalist = document.getElementById(
    "list_task_groups_names"
  ),
  txt_name_group_input = document.getElementById("id_txt_name_group"),
  txtNameGroup_group = document.getElementById("txtNameGroup"),
  input_tags = document.getElementById("id_txt_name_tag"),
  priority = document.getElementsByName("priority_lv");

const btn_save = document.getElementById("btnSave");
const btn_save_group = document.getElementById("btnSave_group");
const btnAddTag = document.getElementById("btnAddtag");
const myStorage = window.localStorage;

let task_card_cont = document.getElementById("cont");
let task_card_cont_groups = document.getElementById("cont-groups");
let counter = 0;
let counter_id_group = 0;

let tasks = [];
let lastedTask = [];
let activeTask = [];
let task;
let tags = ["trabajo", "estudio", "salud", "hogar"];
let temporalTagsForCreation = [];

/* 
   1. Verificar que tareas existen en el almacenamiento

    2. traer  todas las tareas existentes

    agregar nueva tarea 

    enviar todas las tareas al almacenamiento, después de agregar la nueva tarea


    eliminar()
        paso 1 y 2 
        
*/



function format_date(date) {
  let final_date_cut = date.split("T");
  let date_to_string = final_date_cut[0] + " " + final_date_cut[1];

  return date_to_string;
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

function update_task(id) {
  let position = get_position_in_array(id);
  let task_to_edit = tasks[position];

  task_name.value = task_to_edit.task_name;
  initial_date.value = task_to_edit.initial_date;
  final_date.value = task_to_edit.final_date;
  task_description.value = task_to_edit.description_task;
  task_id_code.value = task_to_edit.id_task;

  btn_save.innerText = "actualizar";
}


function separeteRemaing() {
  lastedTask = [];
  activeTask = [];

  tasks.forEach((task) => {
    const remaining = new RemainingDay(task.final_date, new Date());
    if (remaining.remaining_ToString() === "Vencida") {
      lastedTask.push(task);
    } else {
      activeTask.push(task);
    }
  });

  console.log(lastedTask);
  console.log(activeTask);
}



function deleteTag(idElement){
    temporalTagsForCreation.slice(idElement, 0)
}

/**
 *  mostrar tareas
 * 
 */


/* assigment of the events */
btn_save.addEventListener("click", save_task);
btn_save_group.addEventListener("click", createTaskGroup);
btnAddTag.addEventListener("click", save_tag);
input_tags.addEventListener("keydown", set_preview_tag);

window.addEventListener("load", () => {
  create_card();
  //separeteRemaing();
  get_tasks_groups_from_storage();
  set_name_group_in_dataList();
  printAllTask()
});


/* Add a method to check if a task is null This task must be deleted and release its identifier number*/
