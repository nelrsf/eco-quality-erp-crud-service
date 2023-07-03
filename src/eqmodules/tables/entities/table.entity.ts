import { Module } from "src/eqmodules/modules/entities/module.entity";


export class Table extends Module {

    route: string;

    constructor(name: string, label: string, description: string, owner: string) {
        super(name, label, description, owner);
    }

}
