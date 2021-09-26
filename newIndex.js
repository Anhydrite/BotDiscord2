const Discord = require('discord.js')
const bot = new Discord.Client()
const PREFIX = "B";
const YTDL = require('ytdl-core');
const YouTube = require('simple-youtube-api');
// const youtube = new YouTube(require('./clés/cléYTBAPI.js'))
// const youtube2 = new YouTube(require('./clés/cléYTBAPI2.js'))
bot.login(require('./clés/clébotvsai.js'))
// bot.login(require('./clés/clémichougaming.js'))
const Musique = require('./Musique')


let idCle = 4
const search = require('youtube-search');
const ytlist = require('youtube-playlist');

var opts = ((id, maxResult = 1, type = "video") => {
  if (idCle >= 4)
    idCle = 1
  else
    idCle++
  return {
    key: require('./clés/cléYTBAPI' + id + '.js'),
    maxResults: maxResult,
    type: type,
    part: 'snippet',
  }
});

var opts2 = ((id, playlist) => {
  if (idCle >= 4)
    idCle = 1
  else
    idCle++
  return {
    key: require('./clés/cléYTBAPI' + id + '.js'),
    playlistId: playlist,
    maxResults: 100,
    type: "playlistitem",
    part: 'snippet',
  }
});

const emojiCharacters = {
  a: '🇦',
  b: '🇧',
  c: '🇨',
  d: '🇩',
  e: '🇪',
  f: '🇫',
  g: '🇬',
  h: '🇭',
  i: '🇮',
  j: '🇯',
  k: '🇰',
  l: '🇱',
  m: '🇲',
  n: '🇳',
  o: '🇴',
  p: '🇵',
  q: '🇶',
  r: '🇷',
  s: '🇸',
  t: '🇹',
  u: '🇺',
  v: '🇻',
  w: '🇼',
  x: '🇽',
  y: '🇾',
  z: '🇿',
  0: '0⃣',
  1: '1⃣',
  2: '2⃣',
  3: '3⃣',
  4: '4⃣',
  5: '5⃣',
  6: '6⃣',
  7: '7⃣',
  8: '8⃣',
  9: '9⃣',
  10: '🔟',
  '#': '#⃣',
  '*': '*⃣',
  '!': '❗',
  '?': '❓',
};

var lastmsg = {};
var servers = {};
var server;

global.mess;
global.content;

process.on("unhandledRejection", error => {
  console.error("Unhandled promise rejection:", error);
});

bot.on('error', console.error);

bot.on('ready', function () {
  bot.user.setActivity('Bhelp || Bmaj /!\\ 02/01/2021  || Binvite ', {
    type: 'LISTENING'
  })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//        Bavatar
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bot.on('message', message => {
  if (message.content.startsWith('Bavatar')) {
    log(message, "avatar");
    const user = message.mentions.users.first();
    if (user) {
      const avatarList = message.mentions.users.map(user => {
        return `Avatar sexy du membre ${user.username}  ${user.displayAvatarURL()}`;
      });
      message.channel.send(avatarList);
    } else {
      if (message.author.avatarURL) {
        message.channel.send(`Avatar sexy du membre ${message.author.username}  ${message.author.displayAvatarURL()}`);
      } else message.reply("Désolé, tu n'as pas d'avatar personnalisé ! :'( ")
    }
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//        Bping
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on('message', async message => {
  if (message.content === "Bping") {
    log(message, "ping");

    var resMsg = await message.channel.send('> Je sors la regle ! :fish:');
    resMsg.edit('>>> :fish: ```markdown\n# Ping : ' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - bot.ws.ping) + "\n```");
  }
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//        Bplay
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bot.on("message", async function (message) {
  if (message.author.equals(bot.user)) return;

  if (!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0].toLowerCase()) {

    case "play":
      log(message, "play");
      if (!message.member.voice.channel) {
        message.channel.send(">>> Veuillez vous connecter dans un salon audio !");
        return;
      }
      const permissions = message.member.voice.channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(">>> Je n'ai pas les permissions pour venir dans votre salon !");
      }
      if (!servers[message.guild.id]) {
        servers[message.guild.id] = {
          queue: []
        }
      }
      if (!lastmsg[message.guild.id]) {
        lastmsg[message.guild.id] = {
          messages: []
        }
      }


      server = servers[message.guild.id];
      ////PLAYLIST
      if (args[1].includes("www.youtube.com/playlist")) {
        PlaylistToQueue(message, args[1]);
      } else if (YTDL.validateURL(args[1])) {
        await addMusic(message, args[1]);
      } else if (args[1] === "airhorn") {
        await addMusic(message, "https://youtu.be/UaUa_0qPPgc");
      } else {
        await searchMusic(message, args);
      }


      break;



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bearrape
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      case "earrape":
        if (!message.member.voice.channel) {
          message.channel.send(">>> Veuillez vous connecter dans un salon audio !");
          return;
        }
        if(server){
          if(server.dispatcher){
            server.dispatcher.setVolume(20)
          }
        }
      break;

      case "stopearrape":
        if (!message.member.voice.channel) {
          message.channel.send(">>> Veuillez vous connecter dans un salon audio !");
          return;
        }
        if(server){
          if(server.dispatcher){
            server.dispatcher.setVolume(1)
          }
        }
      break;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bqueue
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "queue":
      log(message, "queue");

      server = servers[message.guild.id];
      if (server.queue[1])
        message.channel.send(">>> **" + server.queue.length + "** musique.s en attente")
      else
        message.channel.send(">>> Il n'y pas encore de musiques dans la queue, qu'attends-tu pour en mettre dès maintenant ? :D")
      break;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bsearch
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "search":
      args = args.join(' ')

      search(args, opts(idCle, 6), function (err, results) {
        if (err) {
          message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( \n\n" + "**Message d'erreur** : " + err.message)
          return console.log(err)
        }
        var videos = results
        searching(message, server, videos, args)
      });

      // var videos = await youtube2.searchVideos(args, 5).catch(error => {
      //   message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( \n\n" + "**Message d'erreur** : " + error.message);
      //   return;
      // })


      break;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bskip
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "skip":
      log(message, "skip");

      server = servers[message.guild.id];
      if (args[1]) {
        server.queue.splice(0, args[1] - 1);
        delete server.queue[0];
      }
      if (server.dispatcher) server.dispatcher.end();

      break;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Blist
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "list":

      server = servers[message.guild.id];


      try {
        server.queue;
        queue2(server, message, args[1]);
      } catch (e) { }


      break;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bsearchplaylists
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "searchplaylists134":

      if (!message.member.voiceChannel) {
        message.channel.sendMessage(">>> Veuillez vous connecter dans un salon audio !");
        return;
      }
      var titresplaylist = "";
      args.shift();

      search(args, opts(idCle, 2, 'playlist'), function (err, results) {
        if (err) {
          message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( \n\n" + "**Message d'erreur** : " + err.message)
          return console.log(err)
        }
        var playlists = results

        searching(message, server, playlists)
      });

      return

      try {
        const filter = (reaction, user) => [emojiCharacters[1], emojiCharacters[2], emojiCharacters[3], emojiCharacters[4], emojiCharacters[5]].includes(reaction.emoji.name) && user.id === message.author.id;
        var xd = await youtube.searchPlaylists(args, 5);
        for (i = 0; i < 5 || i < xd.length; i++) {
          titresplaylist += i + 1 + "- " + xd[i].title + "\n";
        }
        message.channel.send(">>> " + titresplaylist).then(async function (msg) {
          await msg.react(emojiCharacters[1]);
          await msg.react(emojiCharacters[2]);
          await msg.react(emojiCharacters[3]);
          await msg.react(emojiCharacters[4]);
          await msg.react(emojiCharacters[5]);

          msg.awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
          })
            .then(collected => {
              const reaction = collected.first();
              switch (reaction.emoji.name) {
                case emojiCharacters[1]:
                  PlaylistToQueue(server, message, xd[0].url);
                  msg.delete(2000);
                  break;

                case emojiCharacters[2]:
                  PlaylistToQueue(server, message, xd[1].url);
                  msg.delete(2000);


                  break;

                case emojiCharacters[3]:
                  PlaylistToQueue(server, message, xd[2].url);
                  msg.delete(2000);

                  break;

                case emojiCharacters[4]:
                  PlaylistToQueue(server, message, xd[3].url);
                  msg.delete(2000);

                  break;

                case emojiCharacters[5]:
                  PlaylistToQueue(server, message, xd[4].url);
                  msg.delete(2000);

                  break;
              }

            }).catch(collected => {
              message.channel.send("Requête annulée pour non-réponse...");
              msg.delete();
            })


        })


      } catch (e) {
        message.channel.send("Je n'ai pas trouvé de playlist !")
      }
      break;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bstop
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "stop":
      log(message, "stop");

      try {
        destroyQueue(message);
      } catch (err) { }
      if (!message.member.voice.channel)
       return message.channel.send(
      ">>> Vous devez être dans un salon vocal pour arrêter la musique"
      );
      if(message.guild.voice)
      message.guild.voice.channel.leave();

      break;


    /////////////////////////////////////////////////////////////////////////////////////////////////no///////////////////////////////////////////////////////////////
    //        Bhelp
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "help":
      log(message, "help");

      message.channel.send("```markdown\n\n# Coucou cher utilisateur, tu peux voir mes fonctionnalités ci-dessous. Have Fun :')\n#\n#\n# • Bplay url → Joue une musique de votre choix (supporte les playlists !)\n#\n# • Bplay airhorn → intensifies !!\n#\n# • Bplay [arguments] → Recherche sur Youtube et joue la musique\n#\n# • Bearrape → Tout est dans le nom\n#\n# • Bstopearrape → Fin de la fête\n#\n# • Bskip nombre → Passe la musique actuelle\n#\n# • Bstop → Arrête la musique en cours et nettoie la file d'attente\n#\n# • Bqueue → Affiche le nombre de musique en attente\n#\n# • Bsearch [Arguments] → Renvoie une liste interactive pour selectionner une musique\n#\n# • Bsearchplaylists [Arguments] → Propose une sélection de playlists \n#\n# • Blist → Affiche les dix prochaines musiques maximum \n#\n# • Binfo → Affiche des informations sur la lecture actuelle \n#\n# • Bping → Latence actuelle(approximatif)\n#\n# • Bavatar → Affiche en grand votre avatar :D\n#\n# • Bavatar @Membre → Affiche en grand l'avatar de @Membre :D\n#\n# • Binvite → Donne mon lien d'invitation !\n#\n# • Bmaj → Te renseigne sur la dernière mise à jour du bot ! \n#\n# • Bbulkdelete → supprime tous les messages peu anciens du bot\n#\n```")
      break;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bmaj
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "maj":
      log(message, "maj");

      message.channel.send(">>> • Passage à Discord v12\n\n • Ajout de la commande Bearrape et Bstopearrape\n\n • Ajout de la commande Binfo\n\n • Investissement dans un vrai serveur !!!!!!\n\n • Les playlists via Bplay sont de nouveau dispo \n\n • Mise a jour des librairies suite a des problemes de lecture des videos sous restriction d'age\n\n • Commande Bsearch de nouveau disponible, Bsearchplaylists desactivé\n\n • CORRECTION DE BUGSSZZ\n\n • Reduction d'utilisation de l'api YouTube\n\n • Mise à jour pour le bon fonctionnement global du bot\n\n • Changement de serveurs  \n\n •  Ajout de la commande Bsearch (voir Bhelp)\n\n •  Mise à jour des services  \n\nDernière mise à jour le 02 Janvier 2021")
      break;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bdebug
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "debug":
      log(message, "debug");

      debug(message, bot)
      break;

    case "warn":
      log(message, "warn");

      const user = message.mentions.users.first();
      if (user) {
        var texte = "";
        for (var i = 2; i < args.length; i++)
          texte += args[i] + " "

        user.sendMessage(texte)
        message.author.send(texte + " accusé de reception")
      } else {
        var m = await message.channel.send(">>> Pas d'utilisateur de ce nom ")
        m.delete(1500)
      }
      message.delete(1600)
      break;

    case "deleteriendutout":
      log(message, "delete");

      message.channel.fetchMessages().then(messages => {
        const botMessages = messages.filter(msg => msg.author.bot);
        message.channel.bulkDelete(botMessages);
      }).catch(err => {
        console.log(err);
      });
      break;





    case "invite":
      log(message, "invite");

      message.channel.send(">>> Voici le lien d'invitation : https://discordapp.com/oauth2/authorize?client_id=563401241053626382&scope=bot&permissions=0");
      break;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Bbulkdelete
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case "bulkdelete":
      log(message, "bulkdelete");

      server = servers[message.guild.id];

      bulkdelete(server, message);
      break;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //        Binfo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case "info":
      log(message, "info");
      server = servers[message.guild.id];
      Binfo(server, message);
      break;

      
  }
})

async function addMusic(message, url, options) {
  try {
    let repeated = 4;
    let getInfos;
    for (; repeated >= 0; repeated--) {
      try {
        getInfos = await YTDL.getBasicInfo(url);
      } catch (err) {
        if (repeated <= 0) {
          console.log(err);
          message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( \n\n" + "**Ajout YTDL-Core Message d'erreur** : " + err.message)
          return;
        }
      }
      try {
        getInfos.videoDetails;
        break;
      } catch (e) {

      }
    }
    server.queue.push(new Musique(
      url,
      getInfos.videoDetails.title,
      getInfos.videoDetails.viewCount,
      getInfos.videoDetails.author.name,
      getInfos.videoDetails.lengthSeconds,
      getInfos.videoDetails.author.thumbnails[0].url,
      getInfos.videoDetails.thumbnails[getInfos.videoDetails.thumbnails.length - 1].url
    ));
    if (options != "playlist")
      message.channel.send(">>> **" + getInfos.videoDetails.title + "** a été ajouté à la position **" + server.queue.length + "**")
    if(!server.queue[1])
      startPlay(message);
  } catch (err) {
    console.log(err);
    message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( \n\n" + "**Ajout YTDL-Core Message d'erreur** : " + err.message)
  }
}

async function searchMusic(message, args) {
  args.shift();
  args = args.join(' ')
  search(args, opts(idCle), async function (err, results) {
    if (err) {
      message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( \n\n" + "**Message d'erreur** : " + err.message)
      return err;
    }
    var video = results
    await addMusic(message, video[0].link);
  });
}

function startPlay(message) {
  if (!message.guild.voiceChannel)
    message.member.voice.channel.join()
      .then(function (connection) {
        play(server, connection, message)
      })
}
async function play(server, connection, message) {
  try {
    if (server.queue[0]) {
      if (!message.guild.voiceChannel){
        message.member.voice.channel.join()
      }
      server.dispatcher = connection.play(await YTDL(server.queue[0].url), {
        type: 'opus',
        highWaterMark: 512
      })


      Binfo(server, message)
      server.dispatcher.on('finish', function () {
        server.queue.shift()
        play(server, connection, message);

      });
    } else {
      connection.disconnect();
      destroyQueue(message);
    }
  } catch (err) {
    console.log(err);
    message.channel.send(">>> Je n'ai pas réussi à ajouter votre vidéo ! :'( (Je vous pris d'eviter de deconnecter le bot manuellement)\n\n" + "**Message d'erreur** : " + err.message)
    if (server.queue[1]) {
      server.queue.shift()
      play(server, connection, message);
    } else {
      connection.disconnect();
      destroyQueue(message);
    }
  }
};

function destroyQueue(message) {
  servers[message.guild.id] = {
    queue: []
  };
}

function log(message, commande) {
  bot.users.cache.get("148482578276417536").send(message.guild.name + " : " + message.author.username + " : " + commande)
}

async function queue2(server, message) {
  var jeaneude = ""
  var msg = await message.channel.send(`Chargement de la liste...`);
  try {
    for (var i = 0; i < server.queue.length && i < 10; ++i) {
      jeaneude += `${i + 1}. ${server.queue[i].title}\n`;
      if (i % 3 == 0)
        msg.edit("Chargement de la liste... Musique " + (i + 1))
    }
    msg.delete()
  } catch (e) {
    message.channel.send(e.message)
  }




  let le_contenu = [{
    name: "__Musique.s en attente.s__",
    value: jeaneude,
    inline: true
  }];

  message.channel.send({
    embed: {
      author: {
        name: "File d'attente"
      },
      color: 0x00FF00,
      fields: le_contenu
    }
  });

}

async function Binfo(server, message, info) {
  if (lastmsg[message.guild.id]) {
    for (let i = 0; i < lastmsg[message.guild.id].messages.length; i++) {
      try {
        await message.channel.fetchMessage(lastmsg[message.guild.id].messages[i]).then(async msg => {
          await msg.delete();
        })
      } catch (err) {
      }
      
    }
  }
  if (server) {
    if (server.queue) {
      if (server.queue[0]) {
        await BinfoEmbed(message);
      } else {
        message.channel.send(">>> Il n'y pas encore de musiques dans la queue, qu'attends-tu pour en mettre dès maintenant ? :D")
      }
    } else {
      message.channel.send(">>> Il n'y pas encore de musiques dans la queue, qu'attends-tu pour en mettre dès maintenant ? :D")
    }

  } else {
    message.channel.send(">>> Il n'y pas encore de musiques dans la queue, qu'attends-tu pour en mettre dès maintenant ? :D")
  }
}


async function BinfoEmbed(msg) {
  let duree;
  const tempDuree = server.queue[0].lengthSeconds;
  if (tempDuree < 60) {
    duree = tempDuree;
  } else if (tempDuree < 3600) {
    duree = `${Math.floor(tempDuree / 60)}m ${tempDuree % 60}`;
  } else if (tempDuree < 86400) {
    duree = `${Math.floor(tempDuree / 3600)}h ${Math.floor(tempDuree % 3600 / 60)}m ${tempDuree % 3600 % 60}`;
  } else if (tempDuree < 604800) {
    duree = `${Math.floor(tempDuree / 86400)}d ${Math.floor(tempDuree % 86400 / 3600)}h ${Math.floor(tempDuree % 86400 % 3600 / 60)}m ${tempDuree % 86400 % 3600 % 60}`;
  }

  var views = "";
  tempviews = server.queue[0].viewCount;
  temp = [];
  for (y = 0, i = 0; y < tempviews.length; y++) {
    if (y == 3 || y == 6 || y == 9 || y == 12) {
      temp[y + i] = " "
      i += 1;
    }
    temp[y + i] = tempviews[tempviews.length - 1 - y];
  }
  for (i = 0; i < temp.length; i++) {
    views += temp[temp.length - 1 - i]
  }

  titreSuivante = "Pas de musique en attente";
  if (server.queue[1])
    titreSuivante = server.queue[1].title;
  let embed_fields = [{
    name: "__Lecture actuelle__",
    value: "**" + server.queue[0].title + "**",
    inline: true
  },
  {
    name: "__Chaîne de l'auteur__",
    value: "**" + server.queue[0].AuthorChannel + "**",
    inline: true
  },
  {
    name: "__Durée__",
    value: "**" + duree + " secondes**",
    inline: true
  },
  {
    name: "__Nombre de vues__",
    value: '**' + views + " vues**",
    inline: true
  },
  {
    name: "__Prochaine musique__",
    value: "**" + titreSuivante + "**",
    inline: true
  },
  {
    name: "__File d'attente__",
    value: "**Il y a " + server.queue.length + " musique.s dans la playlist**",
    inline: true,
  }
  ];
  lastmsg[msg.guild.id].messages.push(await msg.channel.send({
    embed: {
      author: {
        name: "Lien de la vidéo",
        icon_url: server.queue[0].thumbnail,
        url: server.queue[0].url
      },
      thumbnail: {
        url: server.queue[0].avatar
      },
      footer: {
        text: "Ajouté par : " + msg.author.username,
      },
      color: 0x9988EE,
      fields: embed_fields
    }
  }));
}

async function PlaylistToQueue(message, url) {
  let data;
  try {
    ytlist(url).then(res => {
      data = res.data;
    })
  } catch (err) {
    message.channel.send(">>> Je n'ai pas réussi à ajouter votre playlist ! :'( \n\n" + "**Message d'erreur** : " + err.message)
    return console.log(err)
  }
  console.log(data)
  await addAllMusics(message, data);
}

async function addAllMusics(message, data) {
  let loading = await message.channel.send(" Chargement de votre playlist ... 0/" + data.playlist.length);
  let count = 0;
  let valeur = Math.ceil(data.playlist.length / 4);
  for (let i = 0; i < data.playlist.length; i++) {
    try {
      await addMusic(message, data.playlist[i].url, "playlist")
      count += 1;
      if (count % valeur == 0)
        await loading.edit(" Chargement de votre playlist ... " + count + "/" + data.playlist.length)
    } catch (e) {
      break;
    }
  }
  loading.delete();
  message.channel.send(">>> Votre playlist **" + data.name + "** de **" + data.playlist.length + "** musiques a été ajouté, bonne écoute ! ")
}



async function searching(message, videos) {
  let msg = ">>> ";
  let index = 1;
  let loadingMsg = await message.channel.send("Recherche en cours ... 0/6 ")
  try {
    for (let element of videos) {
      msg += index + '. ' + element.title + '\n';
      if (index % 2)
        loadingMsg.edit("Recherche en cours ... " + index + "/6 ")
      index++
    }
  } catch (error) {
    loadingMsg.edit("Une erreur est survenue :" + error.message)
    return
  }
  try {
    const filter = (reaction, user) => [emojiCharacters[1], emojiCharacters[2], emojiCharacters[3], emojiCharacters[4], emojiCharacters[5]].includes(reaction.emoji.name) && user.id === message.author.id;

    loadingMsg.edit(msg).then(async function (msg) {
      await msg.react(emojiCharacters[1]);
      await msg.react(emojiCharacters[2]);
      await msg.react(emojiCharacters[3]);
      await msg.react(emojiCharacters[4]);
      await msg.react(emojiCharacters[5]);
      await msg.react(emojiCharacters[6]);

      msg.awaitReactions(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
      })
        .then(collected => {
          const reaction = collected.first();
          switch (reaction.emoji.name) {
            case emojiCharacters[1]:
              addMusic(message, videos[0].link);
              // PlaylistToQueue(server,message,videos[0].id);
              msg.delete(2000);
              break;

            case emojiCharacters[2]:
              addMusic(message, videos[1].link);
              // PlaylistToQueue(server,message,xd[1].url);
              msg.delete(2000);
              break;

            case emojiCharacters[3]:
              addMusic(message, videos[2].link);
              // PlaylistToQueue(server,message,xd[2].url);
              msg.delete(2000);
              break;

            case emojiCharacters[4]:
              addMusic(message, videos[3].link);
              // PlaylistToQueue(server,message,xd[3].url);
              msg.delete(2000);

              break;

            case emojiCharacters[5]:
              addMusic(message, videos[4].link);
              // PlaylistToQueue(server,message,xd[4].url);
              msg.delete(2000);

              break;
            case emojiCharacters[6]:
              addMusic(message, videos[5].link);
              // PlaylistToQueue(server,message,xd[4].url);
              msg.delete(2000);

              break;
          }
        }).catch(collected => {
          message.channel.send("Requête annulée pour non-réponse...");
          msg.delete();
        })
    })
  } catch (e) {
    message.channel.send("Je n'ai pas trouvé de playlist !")
  }
}
