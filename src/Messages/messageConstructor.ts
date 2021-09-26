import { stringify } from "querystring";
import Queue from "../Queue/Queue";
import Musique from "../tools/Musique";
import messagesManager from "./messagesManager";
import { description } from "BotVsAI";
import Discord from "discord.js";
import botVsAi from "../BotVsAi";

class MessageConstructor {

    constructor() { }

    public messageQueueTitles(queue: Queue): string {

        let message: string = ">>> ";

        const infos: Musique[] = queue.getMusics();

        if(infos.length === 0){

            message += "Aucune musique";
            return message;

        }

        const titles: String[] = infos.map(info => info.title);

        for(let index in titles){

            if(index === "0"){

                message += `_En cours_ : **${titles[index]}**\n`;
                continue;

            }

            message += `_${index}_ : **${titles[index]}**\n`;
        }

        return message;

    }   

    public messageAddMusic(music: Musique): string {
        let message: string = ">>> ";

        message += "**" + music.title + "** ajoutée à la file";

        return message;
    }

    public unknownPlayArgs(message: string | string[]) : string {

        if( this.isStringArray(message) ){
            message = message.join(' ');
        }

        return ">>> Aucun résultat pour " + message;
    }

    public noPlayerRunning():string{
        let string: string = ">>> Il n'y a pas de lecture en cours !"; 
        return string;
    }

    public userNotInVoiceChannel(){
        let string :string = ">>> Vous n'êtes pas dans un salon audio !";
        return string;
    }

    public wrongParam(): string{
        
        let string: string = ">>> Le paramètre n'existe pas !";
        return string;

    }

    public wrongValueForParam(): string{

        let string: string = ">>> La valeur n'est pas valide pour ce paramètre";
        return string;

    }

    public findingNextMusic(title: string): string {
        let string: string = ">>> Autoplay activé, recherche de la prochaine musique avec vos paramètres de diffusion à partir de **" + title + "**";
        return string;
    }

    public paramState(paramName: string, value: string): string{

        let string: string = ">>> Le paramètre **" + paramName + "** est défini sur **" + value +  "**" ;
        return string;

    }

    public nextMusicFound(title:string): string{
        let string: string = ">>> Prochaine musique trouvée : **" + title + "**";
        return string;
    }

    public globalHelp( descriptions: description[] ){

        let embed_fields: Discord.EmbedField[] = [];

        for(let description of descriptions) {
            embed_fields.push(   
                {
                    name: "__" + description.command + "__",
                    value: "**" + description.description + "**",
                    inline: false
                },
            )
        }
        let msg: any = {
            embed : {
                title: "Commandes",
                author: {
                    name: "BotVsAI",
                    icon_url: botVsAi.user.avatarURL()
                },
                image: {
                    url: botVsAi.user.avatarURL()
                },
                color: 0x0055FF,
                fields: embed_fields 
            },
              
        };


        return msg;
    }

    public nextMusicNotFound(title: string): string {
        let string: string = ">>> Je n'ai pas trouvé de musique avec vos paramètres de diffusion à partir de **" + title + "**";
        return string;
    }

    private isStringArray(message: string | string[]): message is string[] {
        return (message as string)[0] !== undefined;
    }
}
const messageConstructor = new MessageConstructor();

export default messageConstructor;