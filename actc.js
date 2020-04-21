const cheerio = require("cheerio");
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ(key) {
  const pilots = [];
  try {
    const urlBase = "https://www.actc.org.ar";
    const url = "/puntos-x-carrera.html";
    const $ = await fetchHTML(urlBase + "/" + key + url);

    $("tbody tr").each((i, el) => {
      const pos = $(el).find("td.pos").text().replace("°", "");
      if (pos.trim() != "") {
        const number = $(el).find("td.pos").next().text();
        const pilot = $(el).find("td.piloto.first").text();
        const cups = $(el).find("td.copas").text();
        const pts = $(el).find("td.pts").text();
        const brand = urlBase + $(el).find("td img").attr("src");
        const data = {
          pos: pos,
          number: number,
          pilot: pilot,
          cups: cups,
          brand: brand,
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

async function calendar(key) {
  const dates = [];
  try {
    const urlBase = "https://www.actc.org.ar";
    const url = "/calendario.html";
    const $ = await fetchHTML(urlBase + "/" + key + url);

    $(".info-race").each((i, el) => {
      //console.log($(el).html());
      const date = $(el).find(".date").text();
      const name = $(el).find(".hd h2").text();
      const desc = $(el).find(".hd p").text();
      const circuit =
        urlBase + $(el).find(".lazy.img-responsive").attr("data-original");
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
  try {
    const champs = champ("tc");
    //calendar("tc"); //  tc | tcp | tcm | tcpm | tcpk
  } finally {
    $respond({
      status: 200,
      body: champs,
    });
  }
}

init();
