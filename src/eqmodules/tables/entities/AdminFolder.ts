export class AdminFolder {

    constructor(private moduleName: string, private collectionName: string, private route?: string){}

    public newFolder = {
        name__document_md: "document-metadata",
        table_metadata: {
          module: this.moduleName,
          table: this.collectionName,
          routeParam: this.collectionName,
          route: this.route ? this.route : '',
          isFolder: true,
          label: "Administración",
          description: "Administración del módulo"
        }
      }
}