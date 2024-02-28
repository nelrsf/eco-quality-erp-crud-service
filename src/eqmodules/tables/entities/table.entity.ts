import { Module } from "src/eqmodules/modules/entities/module.entity";

export type TableModes = 'default' | 'map' | 'form'

export class Table extends Module {

    route: string;
    viewMode: TableModes = 'default';

    constructor(name: string, label: string, description: string, owner: string) {
        super(name, label, description, owner);
    }

}
