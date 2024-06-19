import Task from "./Task.js";
import GroupTask from "./GroupTask.js";

let nameTaskTxt,
  taskDescriptionTxt,
  dateIntial,
  dateFinal,
  dateNow,
  priorityLvl,
  tags = [];

const task_name = document.getElementById("txtName"),
  initial_date = document.getElementById("pickerDateStart"),
  final_date = document.getElementById("pickerDateFinal"),
  task_description = document.getElementById("txtDescription"),
  task_id_code = document.getElementById("txtId"),
  name_group_options_datalist = document.getElementById(
    "list_task_groups_names"
  ),
  txt_name_group_input = document.getElementById("id_txt_name_group"),
  txtNameGroup_group = document.getElementById("txtNameGroup"),
  input_tags = document.getElementById("id_txt_name_tag"),
  priority = document.getElementsByName("priority_lv"),
  dateIsNow = document.getElementById("timeNowId");

const btn_save_group = document.getElementById("btnSave_group");
const btnAddTag = document.getElementById("btnAddtag");
const myStorage = window.localStorage;

const formData = document.querySelector("form");

let counter = 0;
let counter_id_group = 0;

let tasks = [];
let task;
let temporalTagsForCreation = [];
let group_task = [];

/* obtener datos */

function getDataFromForm() {
  setDateInitial(dateIsNow.checked);
  let priorityLvlSelect = getPriority();
  let newTask = new Task(
    task_name.value,
    dateIntial,
    final_date.value,
    task_description.value,
    counter,
    temporalTagsForCreation,
    priorityLvlSelect
  );
  return newTask;
}

function getPriority() {
  console.log(priority);
  let prioritySelect = null;
  for (let i = 0; i < priority.length; i++) {
    if (priority[i].checked) {
      console.log(priority[i].value);
      return priority[i].value;
    }
  }
  return prioritySelect;
}
function save_task(e) {
  e.preventDefault();
  const nameGroup = txt_name_group_input.value;
  if (!validation_of_inputs(e)) {
    console.error("error");
    return;
  }

  let taskToSave = getDataFromForm();

   if (btnSaveTask.textContent == "actualizar") {

    task = tasks[get_position_in_array(task_id_code.value)];

    task.task_name = task_name.value;
    task.initial_date = initial_date.value;
    task.final_date = final_date.value;
    task.description_task = task_description.value;
    task.id_task = task_id_code.value;

    tasks[get_position_in_array(task_id_code.value)] = task;
  }

  if (btnSaveTask.textContent == "Guardar") {
    if (nameGroup != "") {
      let existGroup = validateIsNewGroup(nameGroup);

      if (!existGroup) {
        addNewTaskGroup(nameGroup);
      }

      let indexGroup = findIndexGroupTaskByName(nameGroup);

      add_task_to_group(indexGroup, taskToSave);
      counter++;
      send_counterID_to_storage();
      set_tasks_groups_to_localstorage();
    }

    if (nameGroup == "") {

      get_task_From_storage();
      get_counterID_from_storage();

      tasks.push(taskToSave);
      counter++;
      send_counterID_to_storage();
    }
  }

  send_task_to_storage();
  clean_inputs();
  /* create_card() */;
  btnSaveTask.innerText = "Guardar";
}

function dateNowBoolean() {
  if (dateIsNow.checked) {
    initial_date.disabled = true;
  } else {
    initial_date.disabled = false;
  }
}

function setDateInitial(isChecked) {
  if (isChecked) {
    dateIntial = new Date();
  } else {
    dateIntial = initial_date.value;
  }
}



/* Guardar task individual */


/* group task */
function addNewTaskGroup(nameGroup) {
  group_task.push(new GroupTask(counter_id_group, nameGroup));
  counter_id_group++;
  alert("Grupo creado con éxito.");
  set_tasks_groups_to_localstorage();
}

function add_task_to_group(idGroup, task) {
  group_task[idGroup].tasks_of_group.push(task);
}


/* guardar en localStorage */


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

function set_tasks_groups_to_localstorage() {
  myStorage.setItem("groups_task", JSON.stringify(group_task));
}

function get_tasks_groups_from_storage() {
  let temp = JSON.parse(myStorage.getItem("groups_task"));
  group_task = [];
  if (temp == null) {
    return;
  }
  if (temp.length) {
    group_task = temp;
  }
}

/* agregar etiquetas */


function save_tag(e) {
  e.preventDefault();
  const newTag = input_tags.value;
  const areaPreview = document.getElementById("idPrevTags");
  if (!newTag.length) {
    alert("no puede incluir etiquetas vacías.");
    return;
  }
  if (temporalTagsForCreation.length == 3) {
    alert("Solo puede agregar tres etiquetas por tarea.");
    return;
  }
  if (temporalTagsForCreation.includes(newTag)) {
    alert("Esta etiqueta ya se encuentra agregada.");
    return;
  }

  if (!tags.includes(newTag)) {
    tags.push(newTag);
  }
  temporalTagsForCreation.push(newTag);

  input_tags.value = "";
  areaPreview.innerHTML = "";
  renderTags();
}
function deleteTag(idElement) {
  temporalTagsForCreation.slice(idElement, 0);
}
function renderTags() {
  console.log("renderizando");
  const areaPreview = document.getElementById("idAllTagsAdded");
  let strTags = "";
  temporalTagsForCreation.forEach((element, index) => {
    strTags += `<div class="cont_tag"> ${element} <small  onclick="deleteTag(${index})" data-index-number="${index}" class="btnDeleteTag">X</small> </div>`;
  });
  areaPreview.innerHTML = strTags;
}

/* validations */

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
function validateIsNewGroup(nameGroup) {
  let prueba = group_task.some(
    (task) => task.group_name.toUpperCase() === nameGroup.toUpperCase()
  );
  return prueba;
}




//return a Object type GroupType if this exist in the array
function findIndexGroupTaskByName(nameGroup) {
  return group_task.findIndex((tasks) => tasks.group_name === nameGroup);
}

function get_name_group_from_input() {
  return txtNameGroup.value;
}
function set_name_group_in_dataList() {
  let optionsString = "";

  for (let i = 0; i < group_task.length; i++) {
    optionsString += ` <option value="${group_task[i].group_name}">${group_task[i].group_name}</option>`;
  }
  name_group_options_datalist.innerHTML = optionsString;
  console.log(optionsString);
}

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

/***
 * groupTask
*/
function createTaskGroup(e) {
  e.preventDefault();

  const nameGroup = get_name_group_from_input();
  let isNew = true;

  if (group_task.length > 0) {
    isNew = validateIsNewGroup(nameGroup);
  }

  if (isNew) {
    alert("Ya existe un grupo con este nombre.");
  } else {
    addNewTaskGroup(nameGroup);
    txtNameGroup_group.value = "";
  }

  set_name_group_in_dataList();
}


function clean_inputs() {
  formData.reset()
  document.getElementById("idAllTagsAdded").innerHTML = '';
  temporalTagsForCreation=[]
}

const btnSaveTask = document.getElementById("btnSaveId");
const btnSaveTag = document.getElementById("btnAddtagId");
dateIsNow.addEventListener("change", dateNowBoolean);

btnSaveTask.addEventListener("click", save_task);
btnSaveTag.addEventListener("click", save_tag);
