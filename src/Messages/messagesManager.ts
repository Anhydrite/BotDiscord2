import Discord from "discord.js";
import botVsAi from "../BotVsAi";
import commandsManager from "../commandsManager";
import Logger from "../logger";

class MessagesManager {

    private readonly prefix: string = "C";
    
    private readonly commands: string[] = ["play", "queue", "stop", "skip", "info", "earrape", "stopearrape", "params", "help"];

    constructor(){ }

    public handle(message:Discord.Message): void{

        if(this.CheckAuthor(message)) return ;

        if(!this.checkPrefix(message)) return ;

        let args: string[] = message.content.substring(this.prefix.length).split(" ");

        if(!this.checkCommand(args[0])) return ;
           
        const command = args.shift() !;

        Logger.logAdmin(command, message);

        new commandsManager(command, args, message).handle(); 

    }

    private checkPrefix(message: Discord.Message): boolean{
        return message.content.startsWith(this.prefix);
    }

    private CheckAuthor(message: Discord.Message): boolean {
        return message.author.equals(botVsAi.user); 
    } 

    private checkCommand(message: string): boolean { 
        return this.commands.includes(message); 
    }

    public get Commands(){
        return this.commands;
    }
}

const messagesManager: MessagesManager = new MessagesManager();

export default messagesManager;
