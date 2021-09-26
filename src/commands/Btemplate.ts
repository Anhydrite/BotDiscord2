import Discord from "discord.js";

interface BTemplateConstructor<T extends Btemplate> {
    new(...args: any[]): T
    typeId: string;
  }

abstract class Btemplate{
    
    protected readonly message: Discord.Message;

    readonly typeId = (this.constructor as BTemplateConstructor<this>).typeId; 

    instanceOf<T extends Btemplate>(ctor: BTemplateConstructor<T>): this is T {
        return this.typeId === ctor.typeId
    }

    constructor(message: Discord.Message){
        this.message = message;
    }
}

export default Btemplate;