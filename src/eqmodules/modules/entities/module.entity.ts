import { permission } from "src/guards/Model/Permission"

export class Module {
    name: string
    label: string
    description: string
    owner: string
    isFolder: boolean
    routeParam: string
    permissions: permission

    constructor(name: string, label: string, description: string, owner: string) {
        this.name = name;
        this.label = label;
        this.description = description;
        this.owner = owner;
    }
}
