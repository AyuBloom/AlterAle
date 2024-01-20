// ==UserScript==
// @name         AlterAle
// @namespace    http://tampermonkey.net/
// @version      -
// @description  extra spicy
// @author       rdm
// @match        zombia.io
// @icon         https://cdn.discordapp.com/attachments/476305041981177856/1137276257604739103/AlterAle.webp
// @grant        none
// @run-at       document-start
// ==/UserScript==

var game;
function main() {
    const css = `
        #saved-names {
            display: block;
            position: relative;
            box-shadow: none;
            border: none;
            background: none;
            width: 20px;
            height: 30px;
            margin-bottom: -40px;
            float: right;
            margin-top: 10px;
            color: white;
        }
        .hud-intro::before {
            background: url(https://media.discordapp.net/attachments/1151515144912896092/1198076113621106698/BG_arghena.webp?ex=65bd9654&is=65ab2154&hm=80d69c0d703169bd681d59b1dc9885e6b33259f1fbce7e52de04c33e057e8356&=&format=webp);
            background-size: cover;
        }
        .hud-intro::after {
            content: unset;
        }
        .hud-intro-video {
            position: absolute;
            object-fit: cover;
            top: 0;
            left: 0;
            background: black;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0;
            transition: opacity 1s;
        }
        .hud-intro .hud-intro-leaderboard-toggle {
            top: 10px;
            right: 10px;
        }
        .hud-intro .hud-intro-leaderboard-toggle::before {
            background-color: white;
            filter: grayscale(1);
            border-radius: 50%;
            padding: 10px;
            background-repeat: no-repeat;
            background-position: center;
            zoom: 75%;
            box-shadow: 0 0 20px black;
            opacity: 1;
        }
        .hud-intro-settings {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            background: rgba(0, 0, 0, 0.4);
            padding: 20px;
            margin-left: -15px;
            margin-bottom: -15px;
        }
        #hud-intro-settings > div {
            align-items: flex-start;
        }

        #hud-intro > div.hud-intro-footer > div.hud-intro-footer-center {
            text-shadow: 0 0px 5px rgba(0, 0, 0, 0.5);
            font-weight: bold;
        }
        #hud-intro > div.hud-intro-footer > div.hud-intro-footer-center > p {
            color: #8bfc98;
        }
        #hud-intro > div.hud-intro-footer > div.hud-intro-footer-center a {
            color: #f4e44c;
        }
        .hud-intro .hud-intro-footer .hud-intro-footer-center>:not(:last-child)::after {
            content: unset;
        }
        .hud-intro .hud-intro-footer .hud-intro-footer-center>:not(:first-child):not(:last-child)::after {
            content: "|";
        }
        #hud-intro-form {
            display: block;
            width: 80%;
            margin-left: 10%;
            margin-bottom: 10px;
        }
        #hud-intro-name, #hud-intro-servers {
            background: rgba(0, 0, 0, 0.6);
            color: white;
        }
        #hud-intro-play {
            display: none;
        }
        #hud-intro-error {
            width: 350px;
            position: relative;
            text-align: center;
            margin: auto;
        }
    `;
    const styles = document.createElement("style");
    styles.appendChild(document.createTextNode(css));
    document.head.appendChild(styles);
    styles.type = "text/css";

    function getClass(DOMClass) {
        return document.getElementsByClassName(DOMClass);
    };

    function getId(DOMId) {
        return document.getElementById(DOMId);
    };

    document.querySelector("#hud-intro").insertAdjacentHTML("afterbegin", `
        <video class="hud-intro-video"
            preload="none" src="https://cdn.discordapp.com/attachments/1151515144912896092/1198076102443290664/Arcaea_Arghena_play_cutscene_original_source.mp4?ex=65bd9652&is=65ab2152&hm=cd544283b7c52cc1eda9a9cb2bee11943af12e926a806a2289b9a672881eaea3&"
            autoplay="true" muted="true" loop="true">
        </video>
    `);

    getClass("hud-intro-video")[0].addEventListener("play", ({target}) => { target.style.opacity = 1; });

    game.ui.components.uiIntro.connect = function() {
        if (!this.playElem.classList.contains("disabled")) {
            this.playElem.innerHTML = "<span class='hud-loading'></span>";
            game.network.setConnectionData(
                this.nameElem.value,
                this.partyKey,
                this.servers.find(server => server.id == this.serversElem.value)
            );
            game.network.connect();
        }
    }

    getClass("hud-intro-video")[0].addEventListener("mouseup", game.ui.components.uiIntro.connect.bind(game.ui.components.uiIntro));

    document.querySelector("#hud-intro > div.hud-intro-footer > div.hud-intro-footer-left").insertAdjacentElement("afterbegin", document.querySelector("#hud-intro-settings"));
    document.querySelector("#hud-intro > div.hud-intro-footer > div.hud-intro-footer-center").insertAdjacentElement("afterbegin", document.querySelector("#hud-intro-form"));

    document.querySelectorAll('.hud-intro-stone-1, .hud-intro-stone-2, .hud-intro-tree-1, .hud-intro-tree-2, #hud-intro > div.hud-intro-footer > div.hud-intro-footer-left > a, .hud-intro-wrapper').forEach(el => el.remove());


    /*  const oldCategoryElem = game.ui.components.uiIntroLeaderboard.categoryElem;
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
    game.ui.components.uiIntroLeaderboard.timeElem.addEventListener("change", game.ui.components.uiIntroLeaderboard.requestLeaderboard.bind(game.ui.components.uiIntroLeaderboard)); */

    getClass("hud-intro-form")[0].insertAdjacentHTML("afterbegin", `<select id="saved-names"></select>`);

    (function() {
        if (!localStorage.savedNames) return;
        const selectElem = getId("saved-names");
        JSON.parse(localStorage.savedNames).map(name => {
            const option = document.createElement("option");
            option.innerText = name;
            selectElem.appendChild(option);
        });
        const option = document.createElement("option");
        option.innerText = getId("hud-intro-name").value;
        selectElem.appendChild(option);
    })();

    getId("saved-names").addEventListener('change', ({ target }) => { getClass("hud-intro-name")[0].value = target.selectedOptions[0].innerText; });

    game.network._handleEnterWorldResponse = game.network.handleEnterWorldResponse;
    game.network.handleEnterWorldResponse = function(param) {
        !localStorage.savedNames && (localStorage.savedNames = JSON.stringify([]));
        const willBeSaved = param.name,
              storage = JSON.parse(localStorage.savedNames);
        if (storage.find(i => i == willBeSaved) === undefined && willBeSaved != "Player") {
            storage.push(willBeSaved);
            localStorage.savedNames = JSON.stringify(storage);
        }
        game.network._handleEnterWorldResponse(param);
    }
};

Object.defineProperty(Object.prototype, "ui", {
    get() {
        if (!game) {
            game = this;
            window.game = this;
            main();
        };
        return this._ui;
    },
    set(val) {
        this._ui = val;
    },
    configurable: true
});
