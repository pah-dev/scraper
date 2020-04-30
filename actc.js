//if (steps.init.org == "actc") {
const cheerio = require("cheerio");
const axios = require("axios");

/* let typ = steps.init.typ;
let cat = steps.init.cat;
let year = steps.init.year;
 */
let typ = "champ";
let cat = "tcp";
let year = "2020";

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ() {
  const pilots = [];
  try {
    const urlBase = "https://www.actc.org.ar";
    const url = "/puntos-x-carrera/" + year + ".html";
    const $ = await fetchHTML(urlBase + "/" + cat + url);

    $("tbody tr").each((i, el) => {
      const pos = $(el).find("td.pos").text().replace("°", "");
      if (pos.trim() != "") {
        const number = $(el).find("td.pos").next().text();
        const pilot = $(el).find("td.piloto.first").text();
        const cups = $(el).find("td.copas").text();
        const pts = $(el).find("td.pts").text();
        const brand = "";
        const brandLogo = urlBase + $(el).find("td img").attr("src");
        const data = {
          pos: pos,
          number: number,
          pilot: pilot,
          cups: cups,
          brand: brand,
          brandLogo: brandLogo,
          pts: pts,
        };
        pilots.push(data);
      }
    });
    console.log(pilots);
  } catch (e) {
    console.log(e);
  }
  return pilots;
}

async function events(key) {
  const dates = [];
  try {
    const urlBase = "https://www.actc.org.ar";
    const url = "/calendario/" + year + ".html";
    const $ = await fetchHTML(urlBase + "/" + cat + url);

    $(".info-race").each((i, el) => {
      const date = $(el).find(".date").text();
      const name = $(el).find(".hd h2").text();
      const desc = $(el).find(".hd p").text();
      const circuit_img =
        urlBase + $(el).find(".lazy.img-responsive").attr("data-original");
      const data = {
        dateEvent: date,
        strEvent: name,
        strDescriptionEN: desc,
        strCircuit: desc,
        strMap: circuit_img,
        idEvent: 0,
        strEventAlternate: null,
        strFilename: "",
        strSport: "",
        idLeague: 0,
        strLeague: "",
        strSeason: 0,
        intRound: 0,
        dateEventLocal: "",
        strDate: "",
        strTime: "",
        strTimeLocal: "",
        strTVStation: "",
        strResult: "",
        strCountry: "",
        strCity: "",
        strPoster: "",
        strFanart: "",
        strBanner: "",
        strMap: "",
        strTweet1: "",
        strTweet2: "",
        strTweet3: "",
        strVideo: "",
        strPostponed: "",
        strLocked: "",
      };
      dates.push(data);
    });
    //console.log(dates);
  } catch (e) {
    console.log("EVENTS error: " + e);
  }
  return dates;
}

/* var result;
if (typ == "champ") {
  this.result = await champ();
} else if (typ == "events") {
  this.result = await events();
} else {
  this.result = "Default response: " + cat + " - " + typ;
}
 */
function init() {
  try {
    const champs = champ();
    //events("tc"); //  tc | tcp | tcm | tcpm | tcpk
  } finally {
  }
}

init();
//}
