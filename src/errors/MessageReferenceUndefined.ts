import errorTemplate from "./ErrorTemplate";

class MessageReferenceUndefined extends errorTemplate{ 
    constructor(message?: string){
        super(message);
    }
}
export default MessageReferenceUndefined;