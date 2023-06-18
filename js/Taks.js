import RemainingDay from "./RemainingDay.js"
export default class Task{
    
    task_name;
    initial_date;
    final_date;
    description_task;
    remaining_time;
    id_task;

    constructor(task_name,initial_date,final_date,description_task, id_task){

            this.task_name=task_name;
            this.initial_date=initial_date;
            this.final_date=final_date;
            this.description_task=description_task;
            console.log(description_task)
            this.id_task = id_task
    }

    get_remaining(){
        let remaining = new RemainingDay(this.final_date, new Date());
        this.remaining_time = remaining.remaining_ToString();
    }

}