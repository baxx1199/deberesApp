import Task from "./Task.js";


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
  dateIsNow = document.getElementById('timeNowId');

const btn_save = document.getElementById("btnSave");
const btn_save_group = document.getElementById("btnSave_group");
const btnAddTag = document.getElementById("btnAddtag");
const myStorage = window.localStorage;


const formData= document.querySelector('form')

let counter = 0;
let counter_id_group = 0;

let tasks = [];
let task;
let temporalTagsForCreation = [];

/* obtener datos */



function getDataOpton(e){
  e.preventDefault();
  const data = Object.fromEntries(
    new formData(e.target)
  )
  console.log(data)
}

function getDataFromForm(e) {
    e.preventDefault()
    setDateInitial(dateIsNow.checked)
   // const nameGroup = txt_name_group_input.value;
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
      console.log(newTask);
      return newTask;
}

function getPriority() {
    console.log(priority)
    let prioritySelect = null
    for(let i =0; i< priority.length;i++){
      if(priority[i].checked){
        console.log(priority[i].value)
        return priority[i].value;
      }
    }
    return prioritySelect
  }
function save_task(e) {
    let taskToSave = getDataFromForm()
    
    if (!validation_of_inputs(e)) {
      console.error("error");
      return;
    }
  
    if (btn_save.textContent == "actualizar") {
      task = tasks[get_position_in_array(task_id_code.value)];
  
      task.task_name = task_name.value;
      task.initial_date = initial_date.value;
      task.final_date = final_date.value;
      task.description_task = task_description.value;
      task.id_task = task_id_code.value;
  
      tasks[get_position_in_array(task_id_code.value)] = task;
    }
  
    if (btn_save.textContent == "Guardar") {
      
  
      if (nameGroup.value != "") {
        let existGroup = validateIsNewGroup(nameGroup);
  
        if (!existGroup) {
          addNewTaskGroup(nameGroup);
        }
  
        let indexGroup = findIndexGroupTaskByName(nameGroup);
  
        add_task_to_group(indexGroup, newTask);
        console.log("tarea de grupo");
        counter++;
        send_counterID_to_storage();
        set_tasks_groups_to_localstorage();
      }
      
      if (nameGroup == "") {
        console.log("tarea individual");
        get_task_From_storage();
        get_counterID_from_storage();
  
        tasks.push(newTask);
        counter++;
        send_counterID_to_storage();
      }
    }
  
    send_task_to_storage();
    clean_inputs();
    create_card();
    btn_save.innerText = "Guardar";
  }


  function dateNowBoolean() {
    if(dateIsNow.checked){
      initial_date.disabled = true
    }else{
      initial_date.disabled = false
    }
  }

  function setDateInitial(isChecked){
    if(isChecked){
      dateIntial = new Date();
    }else{
      dateIntial = initial_date.value
    }
  }

/* Guardar task */
/* mostrar task */
/* guardar en localStorage */
/* eliminar de local */
/* agregar etiquetas */


function set_preview_tag() {
  const newTag = input_tags.value;
  const areaPreview = document.getElementById("idPrevTags");

  console.log(areaPreview)
  let strPrevTag = `
          <div class="cont_tag"> ${newTag} </div>
    `;
  areaPreview.innerHTML = strPrevTag;
}

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
  areaPreview.innerHTML=""
  renderTags()
}
function deleteTag(idElement){
    temporalTagsForCreation.slice(idElement, 0)
}
function renderTags() {
  console.log("renderizando")
  const areaPreview = document.getElementById("idAllTagsAdded");
  let strTags =""
  temporalTagsForCreation.forEach((element, index) => {
    strTags +=`<div class="cont_tag"> ${element} <small  onclick="deleteTag(${index})" data-index-number="${index}" class="btnDeleteTag">X</small> </div>`
  });
  areaPreview.innerHTML= strTags
}


const btnSaveTask = document.getElementById("btnSaveId")
const btnSaveTag = document.getElementById("btnAddtagId");
dateIsNow.addEventListener('change', dateNowBoolean)

btnSaveTask.addEventListener('click', getDataFromForm)
btnSaveTag.addEventListener('click', save_tag)
