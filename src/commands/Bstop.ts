import Btemplate from "./Btemplate";
import Discord from "discord.js";
import queuesManager from "../Queue/QueuesManager";
import messageConstructor from "../Messages/messageConstructor";



class Bstop extends Btemplate
{

    static readonly typeId = "Bstop";

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
        
        const queue = queuesManager.getQueue(this.message.guild.id);

        if(queue.hasPlayer()){

            const player = queue.getPlayer();

            player!.stop();

        }else{
            await this.message.channel.send( messageConstructor.noPlayerRunning() );
        }

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

export default Bstop; 