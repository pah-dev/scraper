const fetch = require("node-fetch");
const cheerio = require("cheerio");
const axios = require("axios");

let typ = "drivers";
let cat = "formula-one";
let year = 2020;

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

function compare(a, b) {
  return a < b ? -1 : 1;
}

async function getDrivers() {
  const drivers = [];
  const teams = [];
  try {
    const urlBase = "https://results.motorsportstats.com";
    const url = "/series/" + cat + "/season/" + year + "";
    const $ = await fetchHTML(urlBase + url);
    $("table").each((i, ele) => {
      const head = $(ele).find("thead tr th");
      console.log($(head[0]).text());
      if ($(head[0]).text() == "Teams") {
        let strTeam = "";
        let idTeam = "";
        let idDriver = "";
        $(ele)
          .find("tbody tr")
          .each((j, tr) => {
            const td = $(tr).find("td");
            if ($(td[0]).text().trim() != "") {
              strTeam = $(td[0]).text().trim();
              idTeam = $(td[0])
                .find("a")
                .attr("href")
                .replace("/history", "")
                .replace("/teams/", "");
              teams.push({
                idTeam: idTeam,
                idLeague: "f1",
                idCategory: "f1",
                idMss: cat,
                idRCtrl: "f1",
                strTeam: $(td[0]).text().trim(),
              });
            }
            idDriver = $(td[2])
              .find("a")
              .attr("href")
              .replace("/career", "")
              .replace("/drivers/", "");
            drivers.push({
              idPlayer:
                "F1" + $(td[1]).text().trim() + "-" + $(td[2]).text().trim(),
              idCategory: "f1",
              idMss: idDriver,
              strPlayer: $(td[2]).text().trim(),
              strNumber: $(td[1]).text().trim(),
              idTeam: idTeam,
              strTeam: strTeam,
            });
          });
      }
    });
    const jsonTeams = JSON.stringify(teams);
    const jsonDrivers = JSON.stringify(drivers);

    const responseT = await fetch("http://localhost:3000/team/multicreate", {
      method: "POST",
      body: jsonTeams,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(await responseT.json());
    const responseD = await fetch("http://localhost:3000/driver/multicreate", {
      method: "POST",
      body: jsonDrivers,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(await responseD.json());

    // console.log(teams);
    // console.log(drivers);
  } catch (e) {
    console.log("ERROR GET: " + e);
  }
  return { data: drivers };
}

async function init() {
  try {
    const champs = await getDrivers();
  } catch (err) {
    console.log("ERROR INIT: " + err);
  } finally {
  }
}

init();
