const gameData = {

    async save(data) {
        try {
            data = await JSON.stringify(data);
            await localStorage.setItem("game_data", data);
            return true;
        } catch (err) {
            return false;
        }
    },

    generateData(maxRounds, nameP1, nameP2) {
        const game_data = {
            maxRounds,
            roundNumber: 0,
            gameover: false,
            p1: {
                nickname: nameP1,
                score: 0
            },
            p2: {
                nickname: nameP2,
                score: 0
            },
        }
        return game_data;
    },

    /*

    const last_round = {
        maxRounds: 3,
        roundNumber: 0

        winner: {
            player: "p1 | p2"
        },
    };

    const players_data = {
        p1: {
            nickname: "Arthur",
            score: 0
        },
        p2: {
            nickname: "Gustavo",
            score: 0
        }
    }

    */

    nextRound(last_round, players_data) {
        if (Math.trunc(last_round.maxRounds / 2) < players_data.p1.score) {
            return {
                winner: (players_data.p1.score > players_data.p2.score) ? players_data.p1 : players_data.p2,
                gameover: true,
            };
        }

        const next_game_data = {
            maxRounds: last_round.maxRounds,
            roundNumber: last_round.roundNumber++,
            gameover: false,
            p1: {
                nickname: players_data.p1.nickname,
                score: (last_round.winner.player === "p1") ? players_data.p1.score++ : players_data.p1.score
            },
            p2: {
                nickname: players_data.p2.nickname,
                score: (last_round.winner.player === "p2") ? players_data.p2.score++ : players_data.p2.score
            },
        }
        return next_game_data;
    },

    load() {
        const game_data = JSON.parse(localStorage.getItem("game_data"));
        return game_data;
    }

};




module.exports = gameData;