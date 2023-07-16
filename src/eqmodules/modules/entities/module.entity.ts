import { Permission } from "src/guards/Model/Permission"

export class Module {
    name: string
    label: string
    description: string
    owner: string
    isFolder: boolean
    routeParam: string
    permissions: Permission

    constructor(name: string, label: string, description: string, owner: string) {
        this.name = name;
        this.label = label;
        this.description = description;
        this.owner = owner;
    }
}
