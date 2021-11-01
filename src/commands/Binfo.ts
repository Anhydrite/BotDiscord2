import Discord from "discord.js";
import Queue from "../Queue/Queue";
import queuesManager from "../Queue/QueuesManager";
import Musique from "../tools/Musique";
import Bqueue from "./Bqueue";
import Btemplate from "./Btemplate";



export default class Binfo extends Btemplate {

	static readonly typeId = "Binfo";

	constructor(message: Discord.Message) {
		super(message);
	}

	public async launch(args: string[]): Promise < void > {

		if (typeof this.message.guild === "undefined") return;


		const queue: Queue = queuesManager.getQueue(this.message.guild!.id);

		if (queue.hasInfosMessage()) {

			await queue.deleteInfosMessage();

		}

		const content: Object | undefined = queue.getinfosContent()

		if (typeof content !== "undefined") {

			let message: Discord.Message = await this.message.channel.send(content);

			await queue.linkInfosMessage(message);

		}

	}

	static async BinfoEmbed(guildId: string): Promise < void > {



		const queue: Queue = queuesManager.getQueue(guildId)
		const actualMusic: Musique = queue.actualPlayingMusic();
		const nextMusic: Musique | undefined = queue.NextPlayingMusic();

		let duree: string = "0";

		const tempDuree: number = +actualMusic.lengthSeconds;

		if (tempDuree < 60) {
			duree = tempDuree.toString();
		} else if (tempDuree < 3600) {
			duree = `${Math.floor(tempDuree / 60)}m ${tempDuree % 60}`;
		} else if (tempDuree < 86400) {
			duree = `${Math.floor(tempDuree / 3600)}h ${Math.floor(tempDuree % 3600 / 60)}m ${tempDuree % 3600 % 60}`;
		} else if (tempDuree < 604800) {
			duree = `${Math.floor(tempDuree / 86400)}d ${Math.floor(tempDuree % 86400 / 3600)}h ${Math.floor(tempDuree % 86400 % 3600 / 60)}m ${tempDuree % 86400 % 3600 % 60}`;
		}

		let views: string = "";
		let tempviews: string = actualMusic.viewCount;

		let temp: string[] = [];

		for (let y = 0, i = 0; y < tempviews.length; y++) {
			if (y == 3 || y == 6 || y == 9 || y == 12) {
				temp[y + i] = " "
				i += 1;
			}
			temp[y + i] = tempviews[tempviews.length - 1 - y];
		}
		for (let i = 0; i < temp.length; i++) {
			views += temp[temp.length - 1 - i]
		}

		let titreSuivante: string = "Pas de musique en attente";

		if (typeof nextMusic !== "undefined") {

			titreSuivante = nextMusic.title;

		}

		let embed_fields = [{
				name: "__Lecture actuelle__",
				value: "**" + actualMusic.title + "**",
				inline: true
			},
			{
				name: "__Chaîne de l'auteur__",
				value: "**" + actualMusic.authorChannel + "**",
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
				value: "**Il y a " + queue.getQueueLength() + " musique.s dans la playlist**",
				inline: true,
			}
		];

		let msg: Object = {
			embed: {
				author: {
					name: "Lien de la vidéo",
					icon_url: actualMusic.thumbnail,
					url: actualMusic.url
				},
				thumbnail: {
					url: actualMusic.avatar
				},
				footer: {
					text: "",
				},
				color: 0x9988EE,
				fields: embed_fields
			}
		};

		await queue.linkinfosContent(msg);


	}


}