import Queue from "./Queue";
import { IQueues } from "BotVsAI"



class QueuesManager {
    
    private queues: IQueues;

    constructor() {
        this.queues = {} as IQueues
    } 

    public getQueue(guildId: string){
        const queue: Queue | undefined = this.queues[guildId];

        if(queue instanceof Queue)
            return this.queues[guildId];
        else
            return this.createQueue(guildId);

    }

    private createQueue(guildId: string){
        return this.queues[guildId] = new Queue();
    }

}


const queuesManager = new QueuesManager();

export default queuesManager;