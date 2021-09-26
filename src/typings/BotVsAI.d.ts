declare module 'BotVsAI' {

    type recursiveDescription =  {
        description: string ,
        usage: string,
        command: string 
    };

    export type description = {
        description: string ,
        usage: string,
        command: string 
    } & { [index:string]: recursiveDescription };

    export type paramsType = {
        [index:string]: any
    }

    export interface IHelp {
        [index: string]: description
    }
    
    export interface IPreferences {
        [index: string]: IPreferencesParams
    }
    
    export interface IPreferencesParams {
        copyrightFilter?: boolean,
        autoplay?: boolean
    }

    export interface IQueues {
        [index:string]: import('../Queue/Queue').default
    }
   

}