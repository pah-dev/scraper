if (steps.init.org == "aptp") {
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
      const urlBase = "https://aptpweb.com.ar";
      const url = "/campeonato-clase-";
      const $ = await fetchHTML(urlBase + url + cat);
      $("tbody tr").each((i, ele) => {
        const el = $(ele).find("td");
        data.push({
          pos: $(el[0]).text(),
          number: $(el[1]).text(),
          pilot: $(el[2]).text().trim(),
          cups: $(el[5]).text().trim().replace("x", ""),
          brand: $(el[3]).text().trim(),
          brandLogo: "",
          pts: $(el[4]).text().trim(),
          diff: "",
          lastre: "",
        });
      });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
    return data;
  }

  async function events() {
    const dates = [];
    try {
      const urlBase = "https://aptpweb.com.ar";
      const url = "/calendario-";
      const $ = await fetchHTML(urlBase + url + year);
      $("img.vc_single_image-img.attachment-large").each((i, ele) => {
        dates.push({
          idEvent: dates.length + 1,
          dateEvent: "",
          strEvent: "",
          strDescriptionEN: "",
          strCircuit: "",
          strThumb: $(ele).attr("src"),
        });
      });
      //    console.log(dates);
    } catch (e) {
      console.log("CALENDAR error: " + e);
    }
    return dates;
  }

  async function pilots() {
    const pilots = [];
    try {
      const urlBase = "https://aptpweb.com.ar";
      const url = "/pilotos-clase-";
      const $ = await fetchHTML(urlBase + url + cat);
      $(".vc_single_image-wrapper.vc_box_border_grey").each((i, ele) => {
        const data = {
          strPlayer: "",
          strNumber: "",
          strTeam: "",
          strTeam2: "",
          dateBorn: "",
          strBirthLocation: "",
          strSide: "",
          strThumb: $(ele)
            .find("img")
            .attr("src")
            .replace(".jpg", "-221x300.jpg"),
          strRender: $(ele).find("img").attr("src"),
          strCutout: $(ele).find("img").attr("src"),
          strFanart4: "",
          intLoved: "",
        };
        pilots.push(data);
      });
      pilots.pop();
      //console.log(pilots);
    } catch (e) {
      console.log(e);
    }
    return pilots;
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
