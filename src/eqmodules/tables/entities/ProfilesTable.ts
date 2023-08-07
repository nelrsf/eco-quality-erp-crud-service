export class ProfilesTable {

    constructor(private dbName: string, private collectionName: string, private route?: string) { }

    public newData = [
        {
            Nombre: "Administrador",
            Descripcion: "Administrador del sistema",
            EsAdmin: true
        },
        {
            Nombre: "Funcionario",
            Descripcion: "Perfil para funcionarios de la compañia",
            EsAdmin: false
        },
        {
            Nombre: "Invitado",
            Descripcion: "Perfil solo para visualización",
            EsAdmin: false
        },
    ]

    public newTable = {
        name__document_md: "document-metadata",
        table_metadata: {
            module: this.dbName,
            table: this.collectionName,
            routeParam: this.collectionName,
            route: this.route ? this.route : '',
            label: this.collectionName,
            description: "Tabla de gestión de perfiles"
        },
        Nombre: {
            _id: "Nombre",
            columnName: "Nombre",
            hidden: false,
            required: true,
            type: "string",
            module: this.dbName,
            table: this.collectionName,
            unique: true,
            width: 100,
            isRestricted: false
        },
        Descripcion: {
            _id: "Descripcion",
            columnName: "Descripción",
            hidden: false,
            required: false,
            type: "string",
            module: this.dbName,
            table: this.collectionName,
            unique: false,
            width: 100,
            isRestricted: false,
        },
        EsAdmin: {
            _id: "EsAdmin",
            columnName: "Es Administrador",
            hidden: false,
            required: false,
            type: "boolean",
            module: this.dbName,
            table: this.collectionName,
            unique: false,
            width: 100,
            isRestricted: false,
        }

    }
}