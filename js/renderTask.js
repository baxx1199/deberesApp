import Task from "./Task.js";
import GroupTask from "./GroupTask.js";

function renderTask(){

}

function printAllTask() {
    let strHtmlGroupTask =""
   
  
    for (let i = 0; i < group_task.length; i++) {
      let strHtmlTaskOfGroup =''
      for (let j = 0; j < group_task[i].tasks_of_group.length; j++) {
        betaRemaining(group_task[i].tasks_of_group[j].final_date)
        strHtmlTaskOfGroup+=`<li>${group_task[i].tasks_of_group[j].task_name}</li>` 
      }
      strHtmlGroupTask += `<div class="card card_task_group">
                        <h2> ${group_task[i].group_name}</h2>
                        <br>
                        <ul>${strHtmlTaskOfGroup}</ul>
                  </div>`
    }
    task_card_cont_groups.innerHTML = strHtmlGroupTask
    console.log(group_task)
  }
  
function getAllTask(){

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
  
function updateTask() {
    
}
/* This method opens a modal that displays all the details of the selected task */
function see_details_task(id) {
    let position = get_position_in_array(id);
    if (position === -1) {
      alert("Tarea no encontrada");
      return;
    }
  
    const task_for_modal = tasks[position];
    const remaining = new RemainingDay(task_for_modal.final_date, new Date());
   // const remainingTime = remaining.remaining_ToString();
  
    const string_modal = `
      <button class="btn_close" id="btn_close">X</button>
      <div class="modal_header">
          <h2>${task_for_modal.task_name}</h2>
          <small class="remaining" id="days_remaining_modal">3</small>
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
          <small>Grupo: <span class="group-name">${task_for_modal.group_name}</span></small>
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
  
  /* This method creates all task cards that are in storage */
function create_card() {
    get_task_From_storage(); //First you get the tasks that are in the storage and define a local varibale will container the html in string format and remaining time of every task
    let string_card = "",
      remaining;
    if (tasks.length == 0) {
      string_card = `<h2>No hay tareas pendientes<h2>`;
    }
  
    tasks.forEach((task) => {
      if (task != null) {
        //remaining = new RemainingDay(task.final_date, new Date()); //get the remaining time of the actually task
        string_card += ` 
            <div class="card" >
                <div class="card_header">
                    <h3>${task.task_name}</h3>
                    <small class="remaining" id="days_remaining">3</small>
                </div>
                    <small class="date_label start_date">Inicio: <span>${format_date(
                      task.initial_date
                    )}hrs</span></small>
                     <small class="date_label final_date">Final: <span>${format_date(
                       task.final_date
                     )}hrs</span></small>
                <p>
                    ${task.description_task}
                </p>
                <div class="options">
                    <button class="op op_edit" data-index-task="${
                      task.id_task
                    }">Editar</button>
    
    
                    <button class="op op_delete" data-index-task="${
                      task.id_task
                    }"  >Eliminar</button>
                    <button class="op op_details" data-index-task="${
                      task.id_task
                    }"  >Ver</button>
                </div>
            </div>`;
      }
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

  function close_modal() {
    modal_cont.classList.remove("modal-open");
  }
  