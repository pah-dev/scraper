const cheerio = require("cheerio");
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ(key) {
  const pilots = [];
  try {
    const urlBase = "https://www.auvo.com.uy/calendario/";
    const url = "/campeonato-general.html";
    const $ = await fetchHTML(urlBase + "/" + key + url);

    $("tbody tr").each((i, el) => {
      const pos = $(el).find("td span.label.label-danger").text();
      const number = $(el).find("td").next().html();
      const pilot = $(el).find("td a").text();
      const brand = urlBase + $(el).find("td img").attr("src");
      const cups = $(el).find("td img").next().text();
      const pts = $(el).find("td span.label.label-red").text();
      const data = {
        pos: pos,
        number: number,
        pilot: pilot,
        cups: cups,
        brand: brand,
        pts: pts,
      };
      pilots.push(data);
    });

    console.log(pilots);
  } catch (e) {
    console.log(e);
  }
  return pilots;
}

async function calendar(key) {
  const dates = [];
  try {
    const urlBase = "https://www.auvo.com.uy/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url);

    $(".post-calendario-img").each((i, el) => {
      const date = "";
      const name = "";
      const desc = "";
      const circuit = $(el).find("img").attr("src");
      const data = {
        date: date,
        name: name,
        desc: desc,
        circuit: circuit,
      };
      dates.push(data);
    });

    console.log(dates);
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  return dates;
}

function init() {
  //champ("trseries");
  calendar(""); // toprace | trseries | trjunior
}

init();
