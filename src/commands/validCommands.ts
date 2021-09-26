import Bplay from "./Bplay";
import Bqueue from "./Bqueue";
import Btemplate from "./Btemplate";
import Bstop from "./Bstop";
import Bskip from "./Bskip";
import Binfo from "./Binfo";
import Bearrape from "./Bearrape";
import Bstopearrape from "./Bstopearrape";
import Bparams from "./Bparams";
import Bhelp from "./Bhelp";


type BOBO = {
    [key: string]: any
};


const tableauassociatif: BOBO = {
    play: Bplay,
    queue: Bqueue,
    stop: Bstop,
    skip: Bskip,
    info: Binfo,
    earrape: Bearrape,
    stopearrape: Bstopearrape,
    params: Bparams,
    help: Bhelp
}

type command = keyof typeof tableauassociatif;

function launchFunction(a: command): Btemplate
{
    const fonctioClass: Btemplate = tableauassociatif[a];
    return fonctioClass;
}


export default launchFunction; 