import Discord from "discord.js";
import preferencesManager from "../guildPreferences/preferencesManager";
import messageConstructor from "../Messages/messageConstructor";
import Btemplate from "./Btemplate";



export default class Bparams extends Btemplate {

	static readonly typeId = "Bparams";

    private readonly allowedParams = ["copyrightFilter", "autoplay"];

    constructor(message: Discord.Message){

        super(message);

    }

    public async launch(args: string[]): Promise<void>{


        if(typeof args[0] === "undefined") return;

        let changingParam: string = args[0].toString().trim();

        if( !this.checkParam(changingParam) ) {

            await this.message.channel.send( messageConstructor.wrongParam() );

            return;
        }

        if(this.message.guild === null) return;

        const guildId: string = this.message.guild.id;

        const result: undefined | boolean = preferencesManager[changingParam](guildId, args[1]);

        if(typeof result === "undefined"){
            
            await this.message.channel.send( messageConstructor.wrongValueForParam() );
            return; 
            
        }

        await this.message.channel.send( messageConstructor.paramState(args[0], result.toString()) );


    }

    private checkParam(changingParam: string): boolean {

        return this.allowedParams.includes(changingParam);

    }
}