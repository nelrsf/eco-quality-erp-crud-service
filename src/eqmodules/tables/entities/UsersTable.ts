export class UsersTable {

    public newTable = {
        name__document_md: "document-metadata",
        table_metadata: {
          module: this.dbName,
          table: this.collectionName,
          routeParam: this.collectionName,
          route: this.route ? this.route : '',
          label: this.collectionName,
          description: "Tabla de gestión de usuarios"
        },
        Email: {
          _id: "Email",
          columnName: "Email",
          hidden: false,
          required: true,
          type: "string",
          module: this.dbName,
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
          module: this.dbName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: false
        },
        Perfil: {
          _id:"Perfil",
          columnName: "Perfil",
          hidden: false,
          required: false,
          type: "string",
          module: this.dbName,
          table: this.collectionName,
          unique: false,
          width: 100,
          isRestricted: true,
          moduleRestriction: this.dbName,
          tableRestriction: this.profiesTable,
          columnRestriction:"Nombre"
        }

      }

      constructor(private dbName: string, private collectionName: string, private profiesTable: string, private route?: string){

      }
}