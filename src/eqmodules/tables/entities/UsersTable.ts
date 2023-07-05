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
          _id: "Email",
          columnName: "Email",
          hidden: false,
          required: true,
          type: "string",
          module: this.moduleName,
          table: this.collectionName,
          unique: true,
          width: 100,
          isRestricted: false
        },
        Nombre: {
          _id: "Nombre",
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
          _id: "Cambio de contraseña",
          columnName: "Cambio de contraseña",
          hidden: false,
          required: true,
          type: "boolean",
          module: this.moduleName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        },
        ['Cuenta confirmada']: {
          _id: "Cuenta confirmada",
          columnName: "Cuenta confirmada",
          hidden: false,
          required: true,
          type: "boolean",
          module: this.moduleName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        }

      }
}