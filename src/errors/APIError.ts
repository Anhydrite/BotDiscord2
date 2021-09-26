import errorTemplate from "./ErrorTemplate";

export default class APIError extends errorTemplate{ 
    constructor(message?: string){
        super(message);
    }
}

