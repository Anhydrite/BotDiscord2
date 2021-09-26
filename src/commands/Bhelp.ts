import Discord from "discord.js";
import messageConstructor from "../Messages/messageConstructor";
import messagesManager from "../Messages/messagesManager";
import Btemplate from "./Btemplate";
import fs from "fs";
import { IHelp, description } from "BotVsAI"


export default class Bhelp extends Btemplate {

	static readonly typeId = "Bhelp";

    private readonly commands: string[] = messagesManager.Commands;

    static readonly commandsDescription: IHelp = JSON.parse( fs.readFileSync(process.cwd() +  "/data/commandDescription.json", "utf-8") );

    constructor(message: Discord.Message){
        super(message);
    }

    public async launch(args: string[]): Promise<void>{
        


        if(typeof args[0] === "undefined"){
            this.globalHelp();
        }

       

    }

    private globalHelp(): void{
        let commandsDescription: description[] = [];

        for(let command of this.commands){
            const commandDescription: description = Bhelp.commandsDescription[command];
            commandsDescription.push( commandDescription );
        }

        this.message.channel.send( messageConstructor.globalHelp( commandsDescription ) );
        
    }

   
}
