if (steps.init.org == "fuk") {
  const cheerio = require("cheerio");
  const axios = require("axios");

  let typ = steps.init.typ;
  let cat = steps.init.cat;
  let year = steps.init.year;

  async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  }

  async function champ() {
    const pilots = [];
    try {
      const urlBase = "https://www.com.ar/";
      const url = "/campeonato-general.html";
      const $ = await fetchHTML(urlBase + url);

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
      //console.log(pilots);
    } catch (e) {
      console.log(e);
    }
    return pilots;
  }

  async function events() {
    const dates = [];
    try {
      const urlBase = "http://www.federacionuruguayadekarting.com.uy";
      const url = "/calendario";
      const $ = await fetchHTML(urlBase + url);

      $(".img-calendario").each((i, el) => {
        const date = "";
        const name = "";
        const desc = "";
        const circuitImg = $(el).find("img").attr("src");
        const data = {
          dateEvent: date,
          strEvent: name,
          strDescriptionEN: desc,
          strCircuit: desc,
          strMap: circuitImg,
        };
        dates.push(data);
      });
      //console.log(dates);
    } catch (e) {
      console.log("CALENDAR error: " + e);
    }
    return dates;
  }

  var result;
  if (typ == "champ") {
    this.result = await champ();
  } else if (typ == "events") {
    this.result = await events();
  } else {
    this.result = "Default response: " + cat + " - " + typ;
  }

  /* 
function init() {
  //champ("trseries");
  events(""); // toprace | trseries | trjunior
}

init(); */
}
