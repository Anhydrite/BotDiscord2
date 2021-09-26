import errorTemplate from "./ErrorTemplate";

class GuildNotFound extends errorTemplate{ 
    constructor(message?: string){
        super(message);
    }
}
export default GuildNotFound;