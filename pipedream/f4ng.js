if (steps.init.org == "other") {
  if (steps.init.cat == "f4ng") {
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
      return pilots;
    }

    async function events() {
      const dates = [];
      try {
        const urlBase = "http://www.formula4.com.ar";
        const url = "/calendario/" + year + "/" + year + ".html";
        const $ = await fetchHTML(urlBase + url);
        $(".auto-style9 tbody").each((i, ele) => {
          const el = $(ele).find("tr");
          const date =
            $(el).find(".auto-style3").text().trim() +
            " " +
            $(el).find(".auto-style5").text().trim();
          const name = $(el)
            .find(".auto-style4")
            .text()
            .trim()
            .replace(/\t/g, "")
            .replace(/\n/g, "");
          const desc = $(el)
            .find(".auto-style6")
            .text()
            .trim()
            .replace(/\t/g, "")
            .replace(/\n/g, "");
          const circuitImg =
            urlBase + $(el[1]).find("td img").attr("src").replace("../..", "");
          const data = {
            dateEvent: date,
            strEvent: name,
            strDescriptionEN: desc,
            strCircuit: desc,
            strThumb: circuitImg,
          };
          dates.push(data);
        });
        console.log(dates);
      } catch (e) {
        console.log("EVENTS error: " + e);
      }
      return dates;
    }

    async function pilots() {
      const pilots = [];
      try {
        const urlBase = "http://www.formula4.com.ar/";
        const url = "pilotos/" + year + "/";
        const $ = await fetchHTML(urlBase + url + year + ".html");
        $(".auto-style57 tbody").each((i, ele) => {
          const el = $(ele).find("tr");
          let name = $(el)
            .find(".auto-style70 strong")
            .text()
            .trim()
            .replace(",", ", ");
          const data = {
            strPlayer: name,
            strNumber: $(el).find(".auto-style65 strong").text(),
            strTeam: "",
            strTeam2: "",
            dateBorn: "",
            strBirthLocation: $(el[3]).find(".auto-style60 p strong").text(),
            strSide: "",
            strAgent: "",
            strThumb: urlBase + url + $(el[1]).find("img").attr("src"),
            strRender: urlBase + url + $(el[1]).find("img").attr("src"),
            strCutout: urlBase + url + $(el[1]).find("img").attr("src"),
            strFanart4: urlBase + $(el).find(".auto-style45 img").attr("src"),
            intLoved:
              urlBase + url + $(el).find(".auto-style63 img").attr("src"),
          };
          name != "" ? pilots.push(data) : "";
        });
        console.log(pilots);
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
  }
}
