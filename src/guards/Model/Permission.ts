export class Permission {
    read: Array<string>
    edit: Array<string>

    constructor(){
        this.read = [];
        this.edit = [];
    }
}