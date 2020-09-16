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
      //   console.log($(head[0]).text());
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
                idTeam: "F1-" + idTeam,
                idLeague: "f1",
                idCategory: "f1",
                idMss: cat,
                idRCtrl: "f1",
                strTeam: $(td[0]).text().trim(),
                strRSS: $(td[0]).find("a").attr("href"),
              });
            }
            idDriver = $(td[2])
              .find("a")
              .attr("href")
              .replace("/career", "")
              .replace("/drivers/", "");
            drivers.push({
              idPlayer: "F1-" + $(td[1]).text().trim() + $(td[2]).text().trim(),
              idCategory: "f1",
              idMss: idDriver,
              strPlayer: $(td[2]).text().trim(),
              strNumber: $(td[1]).text().trim(),
              idTeam: idTeam,
              strTeam: strTeam,
              strRSS: $(td[2]).find("a").attr("href"),
            });
          });
      }
    });
    const jsonTeams = JSON.stringify(teams);
    const jsonDrivers = JSON.stringify(drivers);
    const responseT = await fetch(
      "http://localhost:3000/v1/api/team/multicreate",
      {
        method: "POST",
        body: jsonTeams,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(await responseT.json());
    const responseD = await fetch(
      "http://localhost:3000/v1/api/driver/multicreate",
      {
        method: "POST",
        body: jsonDrivers,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(await responseD.json());
  } catch (e) {
    console.log("ERROR GET: " + e);
  }
  return { data: drivers };
}

async function getEvents() {
  const events = [];
  try {
    const urlBase = "https://results.motorsportstats.com";
    const url = "/series/" + cat + "/season/" + year + "";
    const $ = await fetchHTML(urlBase + url);
    $("table").each((i, ele) => {
      const head = $(ele).find("thead tr th");
      if ($(head[0]).text() == "#") {
        $(ele)
          .find("tbody tr")
          .each((j, tr) => {
            const td = $(tr).find("td");
            events.push({
              idEvent:
                "F1-" +
                $(td[2])
                  .find("a")
                  .attr("href")
                  .replace("/results/", "")
                  .replace("/classification", "")
                  .trim(),
              idLeague: "f1",
              idCategory: "f1",
              idMss: cat,
              idRCtrl: "f1",
              intRound: $(td[0]).text().trim(),
              strEvent: $(td[2]).text().trim(),
              strDate: $(td[1]).text().trim(),
              strResult: $(td[4]).text().trim(),
              strCircuit: $(td[3]).text().trim(),
              strRSS: $(td[2]).find("a").attr("href"),
            });
          });
      }
    });
    const jsonEvents = JSON.stringify(events);
    console.log(jsonEvents);
    const response = await fetch("http://localhost:3000/v1/api/event/create", {
      method: "POST",
      body: jsonEvents,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(await response.json());
  } catch (e) {
    console.log("ERROR GET: " + e);
  }
  return events;
}

async function init() {
  try {
    //const drivers = await getDrivers();
    const events = await getEvents();
  } catch (err) {
    console.log("ERROR INIT: " + err);
  } finally {
  }
}

init();
