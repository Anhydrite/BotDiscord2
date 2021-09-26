import Discord from "discord.js";
import Queue from "../Queue/Queue";
import queuesManager from "../Queue/QueuesManager";
import Btemplate from "./Btemplate";
import messageConstructor from "../Messages/messageConstructor";

class Bqueue extends Btemplate{


    static readonly typeId = "Bqueue";


    constructor(message: Discord.Message){ 

        super(message);

    }

    public async launch(args: string[]): Promise<boolean>{

        if(this.message.guild === null) return false;

        const queue: Queue =  this.getQueue(this.message.guild.id)

        const message = messageConstructor.messageQueueTitles(queue);

        await this.message.channel.send(message);

        return true;
    }

    private getQueue(guildId : string): Queue{

        return queuesManager.getQueue(guildId);

    }

}

export default Bqueue;