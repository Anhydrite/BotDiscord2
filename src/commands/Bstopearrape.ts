import Discord from "discord.js";
import messageConstructor from "../Messages/messageConstructor";
import Player from "../Player/Player";
import Queue from "../Queue/Queue";
import queuesManager from "../Queue/QueuesManager";
import Btemplate from "./Btemplate";

export default class Bstopearrape extends Btemplate{


    static readonly typeId = "Bstopearrape";


    constructor(message: Discord.Message){ 

        super(message);

    }

    public async launch(args: string[]): Promise<void>{

        if(!(this.message.guild instanceof Discord.Guild)) return;

        if(!this.isMember(this.message.member)) return;

        if(!this.hasChannel(this.message.member.voice.channel)){

            await this.message.channel.send( messageConstructor.userNotInVoiceChannel() );

            return;
        } 

        const queue: Queue = queuesManager.getQueue(this.message.guild.id);

        const player: Player | undefined = queue.getPlayer();

        if(typeof player === "undefined"){

            await this.message.channel.send(messageConstructor.noPlayerRunning());

            return;

        }

        player.stopEarrape();

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
