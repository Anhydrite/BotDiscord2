import YTDL, { thumbnail } from "ytdl-core";
import Discord from "discord.js";


class Musique {

    public readonly title: string; 
    public readonly url: string;
    public readonly viewCount: string;
    public readonly authorChannel: string; // Objet ? 
    public readonly lengthSeconds: string;
    public readonly avatar: string;
    public readonly Thumbnail: YTDL.thumbnail[]; // Objet ? 
    // public readonly requester: Discord.User;
    public readonly recommendedMusics: YTDL.relatedVideo[];
    public readonly id: string;

    constructor(infos: YTDL.videoInfo)
    {

        this.title = infos.videoDetails.title;
        this.url = infos.videoDetails.video_url;
        this.viewCount = infos.videoDetails.viewCount;
        this.authorChannel = infos.videoDetails.author.name;
        this.lengthSeconds = infos.videoDetails.lengthSeconds;
        this.Thumbnail = infos.videoDetails.thumbnails;
        this.id = infos.videoDetails.videoId;
        // this.requester = infos.requester;
        this.recommendedMusics = infos.related_videos;
        
        if(infos.videoDetails.author.thumbnails !== undefined)
            this.avatar = infos.videoDetails.author.thumbnails[0].url;
        else
            this.avatar = "none";
        
    }


    get thumbnail(): string{


        return this.Thumbnail[0].url;

    }



}

export default Musique;