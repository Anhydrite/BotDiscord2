import axios, { AxiosResponse } from "axios";
import APIError from "../errors/APIError";

class YoutubeAPI {

    private readonly key:string = require('../APIkeys/cléYTBAPI1');
    private readonly baseUrl: string = 'https://www.googleapis.com/youtube/v3/search?key=';
    private readonly playlistUrl: string = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" // PLwiB3T_MRsTyiQIwvpM7XYyh7QBjEY8aF&key=[YOUR_API_KEY]
    constructor(){
    
    }

    public async query(arg :string, limit: number = 1, copyrightFilter: boolean = false): Promise<string[] | undefined>{

        let url: string = this.baseUrl + this.key + "&type=video&part=snippet&maxResults="+ limit +"&q=" + arg;

        if(copyrightFilter){
            url += "&videoLicense=creativeCommon";
        }

        let response: AxiosResponse;

        try {

            response = await axios.get(url);

        }catch(e){

            return undefined;

        }

        if( !this.hasData(response) ){
            new APIError(this.constructor.name);
            return undefined;
        }

        let videosIds = response.data.items.map((e: any) => {return e.id.videoId;});

        return videosIds;

    }

    public async getMusicsFromPlaylist(playlistId: string, maxResults: string = "30"): Promise<string[] | undefined> {

        let url: string = this.playlistUrl + playlistId + `&maxResults=${maxResults}` +`&key=${this.key}`;

        let response: AxiosResponse;

        try {

            response = await axios.get(url);

        }catch(e){

            return undefined;

        }

        if( !this.hasData(response) ){
            new APIError(this.constructor.name);
            return undefined;
        }

        let videosIds = response.data.items.map((e: any) => {return e.snippet.resourceId.videoId;});

        return videosIds;

    }

    private hasData(response: any): any | undefined {
        if(response.data.items !== undefined)
            if(response.data.items.length > 0)
                return true; 
        return false;

    }


}

const youtubeAPI = new YoutubeAPI();
export default youtubeAPI;