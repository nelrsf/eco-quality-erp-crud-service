import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class ErrorDataHandler {

    key = "";
    value = "";

    errors = [
        {
            code: 11000,
            status: HttpStatus.CONFLICT,
            message: (key: string, value: string): string =>
            {
                return `Existe un campo con valor ${value}, el cual ya está incluido en una columna de valores únicos`
            }            
        },
        {
            code: 48,
            status: HttpStatus.CONFLICT,
            message: (key: string, value: string): string =>
            {
                return `El nombre del recurso ya existe`
            }            
        }
    ]

getErrorObjectByCode(error: any): any {
    const errorDataFound = this.errors.find(
        e => e.code === error.code
    )
    if(error?.keyValue){
        this.key = Object.keys(error.keyValue)[0];
        this.value = error.keyValue[this.key];
    }
    if(!errorDataFound){
        return { 
            message: "Error desconocido", 
            status: HttpStatus.BAD_REQUEST 
        };
    }

    return {
        message: errorDataFound.message(this.key, this.value),
        status: errorDataFound.status
    }

}

}