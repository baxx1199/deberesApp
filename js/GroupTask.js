export default class GroupTask{
    id_group;
    group_name;
    tasks_of_group;

    constructor(id_group,group_name){
        this.id_group = id_group;
        this.group_name = group_name;
        this.tasks_of_group = [];
    }
}