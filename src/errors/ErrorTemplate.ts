class errorTemplate {

    private message: string = "";

    constructor (message?: string) {

        if(message !== undefined){
            this.message = " in " + message;
        }
        
        console.error(this.constructor.name + this.message);

    }

} 
export default errorTemplate;