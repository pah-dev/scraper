if (steps.init.org == "auvo") {
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
      const urlBase = "https://www.auvo.com.uy/calendario/";
      const url = "/campeonato-general.html";
      const $ = await fetchHTML(urlBase + "/" + cat + url);

      $("tbody tr").each((i, el) => {
        const pos = "";
        const number = "";
        const pilot = "";
        const brand = "";
        const cups = "";
        const pts = "";
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
      const urlBase = "https://www.auvo.com.uy/";
      const url = "/calendario";
      const $ = await fetchHTML(urlBase + url);

      $(".post-calendario-img").each((i, el) => {
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
    calendar(""); // toprace | trseries | trjunior
  }
  
  init(); */
}
