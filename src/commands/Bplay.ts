import Btemplate from "./Btemplate";
import commandsManager from "../commandsManager";
import Discord, { DiscordAPIError } from "discord.js";
import botVsAi from "../BotVsAi"
import queuesManager from "../Queue/QueuesManager";
import Queue from "../Queue/Queue";
import musicSearcher from "../MusicSearcher/MusicSearcher";
import Musique from "../tools/Musique";
import messageConstructor from "../Messages/messageConstructor";
import Player from "../Player/Player";
import emojiCharacters from "../tools/emojiCharacters";
import preferencesManager from "../guildPreferences/preferencesManager";


class Bplay extends Btemplate 
{

    static readonly typeId = "Bplay";


    constructor(message: Discord.Message) 
    {
        super(message);
    }   

    public async launch(args: string[]): Promise<boolean>{

        preferencesManager;

        if( await this.checkPrerequisites() === false) return false;

        if(!(this.message.guild instanceof Discord.Guild)) return false;

        let queue: Queue = queuesManager.getQueue(this.message.guild.id);
        

        let musiqueItems: Musique[] | undefined = await musicSearcher.computeArgs(args, this.message.guild.id);
 
        if( typeof musiqueItems === "undefined" ){

            await this.message.channel.send( messageConstructor.unknownPlayArgs(args) )

            return false;

        }  

        queue.addMany(musiqueItems);

        this.message.react(emojiCharacters.thumbsup);

        if(!queue.hasPlayer()){

            const player = new Player(this.message, this.message.guild.id);

            player.initiatePlaying();
    
            queue.linkPlayer(player); 
            
            return true;
        }

        const lastAdded: Musique | undefined = queue.getLastTitle();

        if(typeof lastAdded === "undefined") return true;

        await this.message.channel.send( messageConstructor.messageAddMusic(lastAdded) )

        return true;

    }

    private async checkPrerequisites(): Promise<boolean>{

        if(!this.isMember(this.message.member)) return false;

        if(!this.hasChannel(this.message.member.voice.channel)){
            await this.message.channel.send(">>> Veuillez vous connecter dans un salon audio !");
            return false;
        } 

        // if(!this.message.member.voice.channel){
        //     this.message.channel.send(">>> Veuillez vous connecter dans un salon audio !");
        //     return false;
        // }

        const permissions = this.message.member.voice.channel.permissionsFor(botVsAi.user);

        if(permissions === null) return false;

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            await this.message.channel.send(">>> Je n'ai pas les permissions pour venir dans votre salon !");
            return false;
        }

        return true;

    }

    private isMember(member: Discord.GuildMember | null): member is Discord.GuildMember
    {
        return (member as Discord.GuildMember).voice !== undefined; 
    }

    private hasChannel(voice: Discord.VoiceChannel | null): voice is Discord.VoiceChannel
    {
        return (voice as Discord.VoiceChannel)?.permissionsFor !== undefined;
    }

}

export default Bplay; 