import Musique from "../tools/Musique";
import YTDL from "ytdl-core";
import youtubeAPI from './YoutubeAPI';
import messageConstructor from "../Messages/messageConstructor";
import preferencesManager from "../guildPreferences/preferencesManager";

class MusicSearcher {

    private guildId: string | undefined;

    constructor() {

    }

    public async computeArgs(args: string[], guildId: string): Promise<Musique[] | undefined> {

        let urls: string[] = [];

        this.guildId = guildId;

        if(YTDL.validateURL(args[0])){

           urls.push(args[0]);

        }else if( args[0].includes("youtube.com/playlist") ) {


            let results: string[] | undefined = await this.computePlaylists(args);

            if(typeof results === "undefined"){
                return undefined;
            }

            urls.push(...results);

        }else{

            let result = await this.searchMusic(args, 1)
            
            if(typeof result === "undefined"){
                return undefined;
            }

            urls.push(result[0]);

        }

        const musics: Musique[] | Musique | undefined = await this.getInfos(urls);

        if(typeof musics === "undefined"){

            return undefined;
        }
        
        return musics; 

    }

    public async getInfos(urls: string[]): Promise<Musique[] | undefined> {

        try{
            const infos: Musique[] = [];

            for(let url of urls){

                let info = await YTDL.getBasicInfo(url);
                
                if( preferencesManager.copyrightFilter(this.guildId) ){
                    if( this.hasCopyright(info) ){
                        continue;
                    }
                }

                let musicItem: Musique | undefined = this.createMusiqueItem(info);
                
                if(typeof musicItem === "undefined"){

                    continue;

                }

                infos.push(musicItem);

            }

            if(infos === []){

                return undefined;

            }

            return infos;

        }catch(e){

            return undefined;

        }

        

    }

    private hasCopyright(info: any): boolean{
        if(typeof info.videoDetails.media.license !== "undefined"){

            const rights: string =  info.videoDetails.media.license

            if(rights.includes("Creative")){
                return false
            }

            return true;

        }

        return true;

    }

    private async searchMusic(args:string[], limit: number = 1): Promise<string[] | undefined> {
        // https://www.googleapis.com/youtube/v3/search?key=AIzaSyBXQUSlpj5qPGl1UQUSBAcCsMvlS4ILJDA&type=video&part=snippet&maxResults=10&q=jean
        // https://www.googleapis.com/youtube/v3/search?key=API KEY&type=video&part=snippet&maxResults=10&q=QUERY
        let arg: string = args.join(' ');

        let copyrightFilter: boolean | undefined = preferencesManager.copyrightFilter(this.guildId);


        let videosId: string[] | undefined = await youtubeAPI.query(arg, limit, copyrightFilter);

        if(typeof videosId === "undefined"){
            return undefined;
        }

        return videosId;


    }

    private async computePlaylists(args: string[]): Promise<string[] | undefined> {

        let playlistId: string = args[0];

        playlistId = playlistId.split("youtube.com/playlist?list=")[1];

        let videosIds: string[] | undefined = await youtubeAPI.getMusicsFromPlaylist(playlistId);

        return videosIds;

    }

    private createMusiqueItem(infos: YTDL.videoInfo): Musique | undefined{

        try{

            return new Musique(infos);

        }catch(e){
            return undefined
        }

    }


    private hasVideoId(results: string[] | undefined): results is string[]{
        return typeof results !== undefined;
    }

}

const musicSearcher: MusicSearcher = new MusicSearcher();

export default musicSearcher;