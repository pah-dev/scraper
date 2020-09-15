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
    const data = [];
    try {
      const urlBase = "http://www.motoresenpunta.com/";
      const url = "";
      const $ = await fetchHTML(urlBase + url);
      let table = "";
      if (cat == "uyst") {
        table = "1";
      }
      if (cat == "uyse") {
        table = "2";
      }
      $(".tablepress.tablepress-id-" + table + " tbody tr").each((i, ele) => {
        if (i != 0) {
          const el = $(ele).find("td");
          data.push({
            pos: $(el[0]).text(),
            number: "",
            pilot: $(el[1]).text().trim(),
            cups: "",
            brand: "",
            brandLogo: "",
            pts: $(el[2]).text().trim(),
            diff: "",
            lastre: "",
          });
        }
      });
      console.log(data);
    } catch (e) {
      //console.log(e);
    }
    return data;
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
