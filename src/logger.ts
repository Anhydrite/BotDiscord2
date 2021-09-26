import botVsAi from "./BotVsAi";
import Discord from "discord.js";
import UserNotFound from "./errors/UserNotFound";
import GuildNotFound from "./errors/GuildNotFound";
import MessageReferenceUndefined from "./errors/MessageReferenceUndefined";

class Logger {
    private readonly userId: string = "148482578276417536";

    constructor() { }

    public logAdmin(commande: string, message: Discord.Message){

        if(typeof message === null){
            return new MessageReferenceUndefined(this.constructor.name);
        }

        let adminClient: Discord.User | undefined = botVsAi.users.cache.get(this.userId);

        if(adminClient === undefined){
            return new UserNotFound(this.constructor.name);
        }
        if(message.guild === null){
            return new GuildNotFound(this.constructor.name);
        }

        let stringMP = message.guild.name + " : " + message.author.username + " : " + commande;
        
        adminClient.send(stringMP);

    }
}

const logger: Logger = new Logger();
export default logger;