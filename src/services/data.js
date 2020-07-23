export const gameData = {

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
            roundNumber: 1,
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
        roundNumber: 1

        winner: {
            player: 1 | 2
        },
    };

    */

    nextRound(last_round) {
        const data = this.load();
        const players_data = {
            p1: {
                nickname: data.p1.nickname,
                score: (last_round.winner.player === 1) ? ++data.p1.score : data.p1.score
            },

            p2: {
                nickname: data.p2.nickname,
                score: (last_round.winner.player === 2) ? ++data.p2.score : data.p2.score
            }
        };


        if (Math.trunc(data.maxRounds / 2) < players_data.p1.score || Math.trunc(data.maxRounds / 2) < players_data.p2.score) {
            return {
                winner: (players_data.p1.score > players_data.p2.score) ? 1 : 2,
                p1: players_data.p1,
                p2: players_data.p2,
                gameover: true,
            };
        }


        const next_game_data = {
            maxRounds: data.maxRounds,
            roundNumber: ++last_round.roundNumber,
            gameover: false,
            p1: players_data.p1,
            p2: players_data.p2,
        }
        return next_game_data;
    },

    load() {
        const game_data = JSON.parse(localStorage.getItem("game_data"));
        return game_data;
    }

};
