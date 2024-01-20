const oldCategoryElem = game.ui.components.uiIntroLeaderboard.categoryElem;
    const newCategoryElem = oldCategoryElem.cloneNode(true);
    oldCategoryElem.parentNode.replaceChild(newCategoryElem, oldCategoryElem);
    game.ui.components.uiIntroLeaderboard.categoryElem = newCategoryElem;

    const oldtimeElem = game.ui.components.uiIntroLeaderboard.timeElem;
    const newtimeElem = oldtimeElem.cloneNode(true);
    oldtimeElem.parentNode.replaceChild(newtimeElem, oldtimeElem);
    game.ui.components.uiIntroLeaderboard.timeElem = newtimeElem;

    async function fetchLeaderboard(category, time, version) {
        return await fetch("http://zombia.io/leaderboard/data?category=" + category + "&time=" + time + "&version=" + version).then(e => e.json());
    }

    game.ui.components.uiIntroLeaderboard.requestLeaderboard = async function() {
        const allLeaderboardData = [];
        if (this.timeElem.value == "all") {
            let currentVersion = 110;
            const thisVersion = document.querySelector("#hud-intro > div.hud-intro-footer > div.hud-intro-footer-center > p:nth-child(3)").innerText
            .split(" ")[1]
            .split(".")
            .join("");
            while(currentVersion != parseInt(thisVersion)) {
                const data = await fetchLeaderboard(this.categoryElem.value, this.timeElem.value, Array.from(currentVersion + "").join("."));
                allLeaderboardData.push(...data);
                currentVersion++;
            };
        };
        this.leaderboardWrapper.innerHTML = "<div class='hud-loading'></div>";
        const request = new XMLHttpRequest();
        request.open("GET", "http://zombia.io/leaderboard/data?category=" + this.categoryElem.value + "&time=" + this.timeElem.value);
        request.onreadystatechange = () => {
            if (4 !== request.readyState) return;

            let response = JSON.parse(request.responseText);
            if (0 == response.length) return void (this.leaderboardWrapper.innerHTML = "<span>We couldn't find any entries with that query.</span>");

            response.push(...allLeaderboardData);
            response.sort((a, b) => a[this.categoryElem.value] + b[this.categoryElem.value]);
            let leaderboardElem = "<div class='hud-intro-leaderboard-results'>";
            const formatter = new Intl.ListFormat('en', {
                'style': "long",
                'type': "conjunction"
            });
            for (let i = 0; i < 10; i++) {
                const entry = response[i];
                if ('wave' == this.categoryElem.value) {
                    leaderboardElem += "<div class=\"hud-intro-leaderboard-result\"><strong style=\"float: left; font-style: italic;\">" + (i + 1) + '</strong><div>' + formatter.format(entry.players) + " &mdash; <strong>" + entry.wave.toLocaleString() + "</strong></div></div>";
                } else if ('score' == this.categoryElem.value) {
                    leaderboardElem += "<div class=\"hud-intro-leaderboard-result\"><strong style=\"float: left; font-style: italic;\">" + (i + 1) + "</strong><div>" + formatter.format(entry.players) + " &mdash; <strong>" + entry.score.toLocaleString() + "</strong></div></div>";
                }
            }
            leaderboardElem += '</div>';
            this.leaderboardWrapper.innerHTML = leaderboardElem;
        };
        request.send();
    };

    game.ui.components.uiIntroLeaderboard.categoryElem.addEventListener("change", game.ui.components.uiIntroLeaderboard.requestLeaderboard.bind(game.ui.components.uiIntroLeaderboard));
    game.ui.components.uiIntroLeaderboard.timeElem.addEventListener("change", game.ui.components.uiIntroLeaderboard.requestLeaderboard.bind(game.ui.components.uiIntroLeaderboard));
