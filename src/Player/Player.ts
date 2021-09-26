import Discord, { Channel, VoiceConnection } from "discord.js";
import Queue from "../Queue/Queue";
import queuesManager from "../Queue/QueuesManager";
import YTDL from "ytdl-core";
import Binfo from "../commands/Binfo";
import preferencesManager from "../guildPreferences/preferencesManager";
import Musique from "../tools/Musique";
import musicSearcher from "../MusicSearcher/MusicSearcher";
import messageConstructor from "../Messages/messageConstructor";

class Player {

    private connection: Discord.VoiceConnection | null = null;
    private readonly message: Discord.Message;
    private readonly guildId: string;
    private queue: Queue;
    private dispatcher: Discord.StreamDispatcher | null = null;
    private playedMusic: string[];

    constructor(message: Discord.Message, guildId: string) { 
        this;this.playedMusic = [];
        this.message = message;
        this.guildId = guildId;
        this.queue = queuesManager.getQueue(guildId);
        
    }

    public async initiatePlaying(): Promise<boolean>{
        if(! await this.checkConnection()) return false;

        this.play();
 
        return true;
    }

    private async play(): Promise<void> {
        

        if( ! await this.checkConnection() ) {
            return;
        }

        if( ! this.queue.hasStillOne()){

            

            this.stop();
            return;
        } 
        
        this.sendInfosMessage();

        this.dispatcher = this.connection!.play(
            YTDL(this.queue.actualPlayingURL() , {
            }),
            {
                highWaterMark: 512,
                bitrate: "auto",
            },
           
        )

        this.dispatcher.on("error", (e) => {
            console.log(e);
        });

        this.dispatcher.on("finish", async () => {

            if(this.queue.isLast()){
                
                await this.autoplay();
            }

            this.queue.removeFirst();
            this.play();
        });

    } 

    private async autoplay(): Promise<void> {
        if(this.hasAutoplay()){

            const actualMusic: Musique =  this.queue.actualPlayingMusic();
            
            this.playedMusic.push(actualMusic.id);
            const recommendedMusics: YTDL.relatedVideo[] = actualMusic.recommendedMusics;

            const findingNextMusicMessage: Discord.Message = await this.message.channel.send( messageConstructor.findingNextMusic(actualMusic.title) );
            
            let music: Musique[] | undefined;

            for(let recommendedMusic of recommendedMusics){
                if(typeof recommendedMusic.id !== "undefined"){

                    music = await musicSearcher.getInfos( [recommendedMusic.id] )
                    if(typeof music !== "undefined" && typeof music[0] !== "undefined" && !this.playedMusic.includes(music[0].id) ){
                        break;
                    }
                }
            }

            if(typeof music !== "undefined"  && typeof music[0] !== "undefined"){
                findingNextMusicMessage.edit( messageConstructor.nextMusicFound( music[0].title ) );
                findingNextMusicMessage.delete( { timeout: 20000 } );
                this.playedMusic.push(music[0].id)
                this.queue.addOne(music[0]);
                return;
            }

            findingNextMusicMessage.edit( messageConstructor.nextMusicNotFound(actualMusic.title) );
            findingNextMusicMessage.delete( { timeout: 20000 } );

        }
    }

    private hasAutoplay(): boolean {

        const activated: void |boolean = preferencesManager.autoplay(this.guildId);

        if(typeof activated === "undefined"){
            return false;
        }

        return activated;

    }

    public async stop(): Promise<void> {

        if(this.dispatcher !== null ){

            this.dispatcher.destroy();

        }

        if(this.connection !== null){

            this.connection.disconnect();

        }

        if(this.queue.hasInfosMessage()){

            await this.queue.deleteInfosMessage();
        }
        
        this.queue.destroy();

    }

    public end(): void{

        if(this.dispatcher !== null){
            // this.dispatcher.end();
            this.dispatcher.emit("finish");
        }
    }
    
    private async checkConnection(): Promise<boolean> {

        if(! (this.isGuild(this.message.guild))) return false;

        if(! (this.isMember(this.message.member))) return false;

        if(! (this.isVoice(this.message.member.voice))) return false;

        if(! (this.isChannel(this.message.member.voice.channel))) return false;

        if(this.connection === null)
            this.connection = await this.message.member.voice.channel.join();   

        if(this.connection === undefined) return false;

        return true;
    }

    public async sendInfosMessage(){

        if(this.queue.hasInfosMessage()){

            await this.queue.deleteInfosMessage();

        }

        await Binfo.BinfoEmbed(this.message.guild!.id);

        let content: Object | undefined = this.queue.getinfosContent();

        if(typeof content === "undefined") return;

        let message: Discord.Message = await this.message.channel.send(content);

        await this.queue.linkInfosMessage(message);
    }

    public earrape():void {
 
        if(this.dispatcher === null) return;

        this.dispatcher.setVolume(20);

    }

    public stopEarrape():void {

        if(this.dispatcher === null) return;

        this.dispatcher.setVolume(1);

    }

    private isGuild(guild: Discord.Guild | null): guild is Discord.Guild {

        return guild instanceof Discord.Guild;

    }

    private isVoice(voice: Discord.VoiceState | null): voice is Discord.VoiceState {

        return voice instanceof Discord.VoiceState;

    }

    private isChannel(channel: Discord.VoiceChannel | null): channel is Discord.VoiceChannel {

        return channel instanceof Discord.VoiceChannel;

    }

    private isMember(member: Discord.GuildMember | null): member is Discord.GuildMember {

        return member instanceof Discord.GuildMember;

    }


}

export default Player;