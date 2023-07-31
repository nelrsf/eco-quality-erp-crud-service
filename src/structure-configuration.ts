import { Injectable } from "@nestjs/common";

@Injectable()
export class StructureConfiguration {
    constants = {
        usersTable: 'Usuarios',
        profiesTable: 'Perfiles',
        adminFolder: 'Administración'
    }
}
