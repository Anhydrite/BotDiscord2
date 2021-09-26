import path, { parse } from "path";
import fs from "fs";
import { IPreferences, IPreferencesParams} from 'BotVsAI';



class PreferencesManager {
    
    private readonly path: string; 
    private preferences: IPreferences;

    constructor(){ 

        this.path = process.cwd() + "\\data\\preferences.json";

        const preferences3: string = fs.readFileSync(this.path, "utf-8");

        this.preferences = JSON.parse(preferences3);

        
    }

    public copyrightFilter(guildId: string, activated: string): void | boolean {

        if(typeof activated === "undefined"){

            return this.getCopyright(guildId);

        }

        if( !this.isBoolean(activated) ) return;

        const state: boolean = (activated === "true");

        this.preferences[guildId]['copyrightFilter'] = state;

        this.save();

        return state;

    }
    
    public autoplay(guildId: string, activated:string): void | boolean {
        if(typeof activated === "undefined"){

            return this.getAutoplay(guildId);

        }

        if( !this.isBoolean(activated) ) return;

        const state: boolean = (activated === "true");

        this.preferences[guildId].autoplay = state;

        this.save();

        return state;
    }


    private isBoolean(arg: string): boolean {

        if(arg === "true" || arg === "false"){
            return true;
        }

        return false;
        
    }

    private getCopyright(guildId: string): boolean{

        const preferences: IPreferencesParams | undefined = this.preferences[guildId];

        if(typeof preferences === "undefined") return false;

        if(typeof preferences.copyrightFilter === "undefined") return false;

        return preferences.copyrightFilter;

    }

    private getAutoplay(guildId: string): boolean{

        const preferences: IPreferencesParams | undefined = this.preferences[guildId];

        if(typeof preferences === "undefined") return false;

        if(typeof preferences.autoplay === "undefined") return false;

        return preferences.autoplay;

    }


    private save(): void{

        const stringPreferences: string = JSON.stringify(this.preferences);

        fs.writeFileSync(this.path, stringPreferences);
        
    }

    // set preferences(val){
    //     console.log(this.preferences);

    //     this.Preferences = val;
    // }

    /* 
 constructor() {
        this.queues = {} as IQueues
    } 

    public getQueue(guildId: string){
        const queue: Queue | undefined = this.queues[guildId];
 
        if(queue instanceof Queue)
            return this.queues[guildId];
        else
            return this.createQueue(guildId);

    }

    private createQueue(guildId: string){
        return this.queues[guildId] = new Queue();
    }

*/

}

type paramsType = {
    [index:string]: any
}

const preferencesManager: paramsType = new PreferencesManager();

export default preferencesManager;