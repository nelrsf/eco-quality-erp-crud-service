export class AdminFolder {

    constructor(private dbName: string, private collectionName: string, private route?: string){}

    public newFolder = {
        name__document_md: "document-metadata",
        table_metadata: {
          module: this.dbName,
          table: this.collectionName,
          routeParam: this.collectionName,
          route: this.route ? this.route : '',
          isFolder: true,
          label: this.collectionName,
          description: "Administración del módulo"
        }
      }
}