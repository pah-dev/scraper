if (steps.init.org == "tr") {
  const cheerio = require("cheerio");
  const axios = require("axios");

  let typ = steps.init.typ;
  let cat = steps.init.cat;
  let year = steps.init.year;

  async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  }

  async function info() {
    const info = [];
    try {
      const urlBase = "https://www.toprace.com.ar/";
      const url = "institucional/top-race.html";
      const $ = await fetchHTML(urlBase + url);
      //const rrss = "actcargentina";
      //const intro = $("body").find(".info p").text() + "\r\n";
      let desc = $("body").find(".news-snippet.mb64 p").text().trim();
      desc = desc.split("\t").join("").trim();
      desc = desc.split("  ").join("").trim();
      desc = desc.split(".\n").join("@@").trim();
      desc = desc.split("\n").join("").trim();
      desc = desc.split("@@").join("\n").trim();
      /* desc = desc.split(".0").join("##");
    desc = desc.split(".").join("\r\n");
    desc = desc.split("@@").join(".");
    desc = desc.split("##").join(".0"); */
      const data = {
        strLeague: $("body").find(".news-title h3").text().replace("LA ", ""),
        strLogo: urlBase + $("body").find(".logo.skew img").attr("src"),
        strDescriptionEN: desc,
        strDescriptionES: desc,
        strPoster: "",
        strBanner: urlBase + $("body").find("img.logo").attr("src"),
        strWebsite: urlBase,
        strFacebook: $("body").find(".skew.facebook div a").attr("href"),
        strTwitter: $("body").find(".skew.twitter div a").attr("href"),
        strInstagram: $("body").find(".skew.instagram div a").attr("href"),
        strYoutube: $("body").find(".skew.youtube div a").attr("href"),
      };
      info.push(data);
      // });
      console.log(info);
    } catch (e) {
      console.log(e);
    }
    return info;
  }

  async function champ() {
    const pilots = [];
    try {
      const urlBase = "https://www.toprace.com.ar/";
      const url = "/campeonato-general.html";
      const $ = await fetchHTML(urlBase + "/" + cat + url);

      $("tbody tr").each((i, el) => {
        const pos = $(el).find("td span.label.label-danger").text();
        const number = $(el).find("td").next().html();
        const pilot = $(el).find("td a").text();
        const brand = "";
        const brandLogo = urlBase + $(el).find("td img").attr("src");
        const cups = $(el).find("td img").next().text();
        const pts = $(el).find("td span.label.label-red").text();
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
      const urlBase = "https://www.toprace.com.ar";
      const url = "/calendario.html";
      const $ = await fetchHTML(urlBase + "/" + cat + url);

      $(".day-item").each((i, el) => {
        const date = $(el).find("div h5.mb0").text();
        const name = $(el).find("div.circuit-title h2").text();
        const desc = $(el).find(".circuit-name").text();
        const circuitImg = urlBase + $(el).find(".pilot-thumb").attr("src");
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

  async function pilots() {
    const pilots = [];
    try {
      const urlBase = "https://www.toprace.com.ar";
      const url = "/pilotos.html";
      const $ = await fetchHTML(urlBase + "/" + cat + url);
      $(".kf_roster_dec.kf_roster_dec6").each((i, ele) => {
        const data = {
          strPlayer: $(ele).attr("title"),
          strNumber: $(ele).find("h5").text(),
          strTeam: $(ele).find("span.display-block").text(),
          strTeam2: "",
          dateBorn: "",
          strBirthLocation: "",
          strSide: "",
          strAgent: "",
          strThumb: urlBase + $(ele).find(".pilot-thumb").attr("src"),
          strRender: urlBase + $(ele).find(".pilot-thumb").attr("src"),
          strCutout: urlBase + $(ele).find(".pilot-thumb").attr("src"),
          strFanart4: urlBase + $(ele).find(".logo img").attr("src"),
          intLoved: urlBase + $(ele).attr("href"),
        };
        pilots.push(data);
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

  /* function init() {
  champ("toprace");
  events("toprace"); // toprace | trseries | trjunior
}

init();
 */
}
