export interface IRead {
    read: Array<string>
}

export interface IDelete {
    delete: Array<string>
}

export interface IEdit {
    edit: Array<string>
}


export interface IUserAccess {
    userAccess: {
        edit: boolean,
        read: boolean,
        delete: boolean
    }
}