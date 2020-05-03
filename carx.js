if (steps.init.org == "carx") {
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
    const data = [];
    try {
      const urlBase = "http://carxrallycross.com/";
      const url = "campeonato-";
      const $ = await fetchHTML(urlBase + url + cat);

      $("tbody tr").each((i, ele) => {
        if (i != 0) {
          const el = $(ele).find("td");
          data.push({
            pos: $(el[0]).text(),
            number: $(el[1]).text(),
            pilot: $(el[2]).text(),
            cups: "",
            brand: "",
            brandLogo: "",
            pts: $(el).children().last().text().trim(),
            diff: "",
            lastre: "",
          });
        }
      });
      //console.log(data);
    } catch (e) {
      console.log(e);
    }
    return data;
  }

  async function events() {
    const dates = [];
    try {
      const urlBase = "http://carxrallycross.com";
      const url = "/calendario";
      const $ = await fetchHTML(urlBase + url);
      $("tbody tr.prox-calen").each((i, ele) => {
        const el = $(ele).find("td");
        dates.push({
          idEvent: $(el[0]).text().trim(),
          dateEvent: $(el[1]).text().trim(),
          strEvent: $(el[2]).text().trim(),
          strDescriptionEN: "",
          strCircuit: "",
          strThumb: "",
        });
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

  /* function init() {
    champ("toprace");
    events("toprace"); // toprace | trseries | trjunior
  }
  
  init();
   */
}
