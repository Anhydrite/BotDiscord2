import Discord from "discord.js";
import botVsAi from "./BotVsAi";
import validCommands from "./commands/validCommands";

export default class commandsManager{

    private readonly command: string;
    private readonly args: string[];
    private readonly message: Discord.Message;

    constructor(command: string, args: string[], message: Discord.Message){
        this.command = command;
        this.args = args;
        this.message = message;
    }

    public handle(){
        let fn: string = this.command.toString().trim();
 
        let fonctioClass: any = validCommands(fn);

        let bcommand: any = new fonctioClass(this.message);

        bcommand.launch(this.args);

    }   

    public async info(text: string): Promise<void>{
        await this.message.channel.send(text);
    }
}
