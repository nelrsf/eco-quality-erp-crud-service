export class Module {
    name: string
    label: string
    description: string

    constructor(name: string, label: string, description: string) {
        this.name = name;
        this.label = label;
        this.description = description;
    }
}
