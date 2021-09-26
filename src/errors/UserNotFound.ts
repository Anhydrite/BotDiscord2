import errorTemplate from "./ErrorTemplate";

class UserNotFound extends errorTemplate{ 
    constructor(message?: string){
        super(message);
    }
}
export default UserNotFound;