import Discord from "discord.js";
import Player from "../Player/Player";
import Musique from "../tools/Musique";

class Queue {

    private musics: Musique[];
    private player: Player | undefined;
    private infosContent: Object | undefined;
    private infosMessage: Discord.Message | undefined;

    constructor(music?: Musique | Musique[]) {
        if(typeof music !== "undefined"){
            if(music instanceof Musique)
                this.musics = [music];
            else
                this.musics = music
        }else{
            this.musics = [] as Musique[]; 
        }
        
    }

    public addOne(music: Musique): void{

        this.musics.push(music);

    }

    public addMany(musics: Musique[]):void {

        this.musics.push(...musics);

    }

    public removeLast(): Musique | undefined{

        return this.musics.pop()

    }

    public removeFirst(): Musique | undefined{

        return this.musics.shift();

    }

    public isLast(): boolean {

        if(typeof this.musics[1] === "undefined")
            return true;

        return false;
    }

    public removeOne(index: number): Musique | undefined {

        return this.musics.splice(index, 1)[0];

    }


    public getMusics(): Musique[]{

        return [...this.musics];

    }

    public getQueueLength(): number {
        return this.musics.length;
    }

    public actualPlayingURL(): string {

        return this.musics[0].url;

    }

    public actualPlayingMusic(): Musique {

        return this.musics[0];

    }

    
    public NextPlayingMusic(): Musique | undefined {

        if(typeof this.musics[1] !== "undefined"){

            return this.musics[1];

        }
        return undefined;

    }

    public getLastTitle(): Musique | undefined {
        
        if(typeof this.musics === "undefined") return undefined;

        return this.musics[ this.musics.length - 1 ];


    }

    public hasStillOne(): boolean {

        return this.musics[0] !== undefined;

    }

    public destroy(): void {

        this.musics = [] as Musique[]; 
        this.player = undefined;
        
    }

    public skip(nbr: number): void{

        const musicsLength = this.musics.length - 1;

        if(musicsLength > nbr){

            this.musics.splice(0, nbr);

        }else{
            for(let i: number = 0; i < nbr && i < musicsLength; i++ ){
                console.log("mus")
                this.musics.shift();
            }
        }

    }

    

    public linkPlayer(player: Player){
        this.player = player;
    }
    
    public getPlayer(): Player | undefined{
        return this.player;
    }

    public hasPlayer():Boolean {

        return this.player !== undefined;

    }

    public linkinfosContent(infosContent: Object): void{
        this.infosContent = infosContent;
    }

    public getinfosContent(): Object | undefined{

        if(typeof this.infosContent !== "undefined"){

            return this.infosContent

        }

        return undefined;
    }
    
    public async linkInfosMessage(message: Discord.Message): Promise<void>{

        if(this.hasInfosMessage()){

            await this.deleteInfosMessage();
    
        }

        this.infosMessage = message;

    }

    public hasInfosMessage(): Boolean{
        if(typeof this.infosMessage !== "undefined") {

            return true

        }

        return false;
    }

    public getInfosMessage(): Discord.Message | undefined {

        if(typeof this.infosMessage !== "undefined") {

            return this.infosMessage
 
        }

        return undefined;
    }

    public async deleteInfosMessage(): Promise<void> {

        
        if(typeof this.infosMessage !== "undefined") {

        try{

            await this.infosMessage.delete();

        }catch(e){ }

           this.infosMessage = undefined;

        }

        return;

    }

}
export default Queue;