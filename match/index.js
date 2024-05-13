const { getAmountOfTickets } = require("./main");
const { getGames } = require("./dynamo");
const { tweetAmountOfTicketsLeft } = require("./twitter");

module.exports = {
	handler: async () => {
		const games = await getGames();
		const gamesToPost = [];
		for (const game of games) {
			if (new Date(game.match_time) > new Date()) {
				const amount = await getAmountOfTickets(game.url);
				gamesToPost.push({ name: game.pk, amount });
			}
		}

		for (const gamePost of gamesToPost) {
			await tweetAmountOfTicketsLeft(gamePost.name, gamePost.amount);
		}
	},
};
