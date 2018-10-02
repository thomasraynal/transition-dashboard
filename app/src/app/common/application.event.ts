export class ApplicationEvent<TEntity> {

    constructor(public reason: string, public subject: TEntity, public message: string = '') {
    }
}