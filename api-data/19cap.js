const fetch = require("node-fetch");
const cheerio = require("cheerio");
const axios = require("axios");

// let typ = steps.init.typ;
// let cat = steps.init.cat;
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
  try {
    const urlBase = "http://www.19capitaleshistorico.com/";
    const url = "edicion/" + year + "/lista-de-inscriptos";
    const $ = await fetchHTML(urlBase + url);
    $("tbody tr").each((i, ele) => {
      if (i > 1) {
        const el = $(ele).find("td");
        const data = {
          idPlayer:
            "GPU" +
            $(el[7]).text() +
            "-" +
            $(el[1]).text().trim() +
            "/" +
            $(el[3]).text().trim(),
          idCategory: "capi",
          strPlayer: $(el[1]).text().trim() + " / " + $(el[3]).text().trim(),
          strNumber: $(el[7]).text().trim(),
          strTeam:
            $(el[4]).text() + " " + $(el[5]).text() + " " + $(el[6]).text(),
          strThumb: "",
        };
        drivers.push(data);
      }
    });
    drivers.sort((a, b) => {
      return compare(a.strNumber, b.strNumber);
    });
    const json = JSON.stringify(drivers);
    console.log(json);

    const response = await fetch("http://localhost:3000/driver/multicreate", {
      method: "POST",
      body: json,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(await response.json());
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
