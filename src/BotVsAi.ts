import Discord, { Message } from "discord.js";
import YTDL from "ytdl-core"
import { EventEmitter } from "events";
import preferencesManager from "./guildPreferences/preferencesManager";


class BotVsAi extends EventEmitter {

    private readonly bot: Discord.Client = new Discord.Client();
    private readonly prefix: string = "B";
    private readonly key: string = require("./clés/clémichougaming.js");
  
    
    
    constructor(){
        super(); 

        this.bot.login(this.key);    
        this.bindEvent();
        this.on("ready", () => {
            this.setActivity();
        })
        //this.bot.on('message', this.messageManager);
    } 
 
    private bindEvent():void {

        this.bot.on('ready', () => {
            this.emit("ready");
        });

        this.bot.on('message', (message: Discord.Message) => {
            this.emit("message", message);
        })

    }

    public sendMessage(text: string, newMessage: Discord.Message): void{
        newMessage.channel.send(text);
    }

    private setActivity(): void{
        this.user.setActivity('Bhelp || Bmaj /!\\ 02/01/2021  || Binvite ', {
            type: 'LISTENING'
        }).then( () => {
            console.log("c good");
        })
        .catch(console.error);
    }

    get user(): Discord.ClientUser {

        if(this.bot.user === null){
            throw new Error();
        }
        
        return this.bot.user;
    }

    get users(): Discord.UserManager
    {
        if(this.bot.users === null){
            throw new Error()
        }
        return this.bot.users;
    }

    


}

const botVsAi: BotVsAi = new BotVsAi();

export default botVsAi;

