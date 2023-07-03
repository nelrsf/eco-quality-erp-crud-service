export class UsersTable {

    constructor(private moduleName: string, private collectionName: string){}

    public newTable = {
        name__document_md: "document-metadata",
        table_metadata: {
          module: this.moduleName,
          table: this.collectionName,
          label: "Usuarios",
          description: "Tabla de gestión de usuarios"
        },
        Email: {
          columnName: "Email",
          hidden: false,
          required: true,
          type: "string",
          module: this.moduleName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        },
        Nombre: {
          columnName: "Nombre",
          hidden: false,
          required: true,
          type: "string",
          module: this.moduleName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        },
        ['Cambio de contraseña']: {
          columnName: "Cambio de contraseña",
          hidden: false,
          required: true,
          type: "string",
          module: this.moduleName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        },
        ['Cuenta confirmada']: {
          columnName: "Cuenta confirmada",
          hidden: false,
          required: true,
          type: "string",
          module: this.moduleName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        }

      }
}