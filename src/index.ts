import path from "path";
import botVsAi from "./BotVsAi";
import Discord from "discord.js";
import messagesManager from "./Messages/messagesManager";


path.join("d");

botVsAi.on('message', (message: Discord.Message) => {  
    messagesManager.handle(message);
})