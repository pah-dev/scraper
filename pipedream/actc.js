if (steps.init.org == "actc") {
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
      const urlBase = "https://www.actc.org.ar";
      const url = "/institucional/la-actc.html";
      const $ = await fetchHTML(urlBase + url);
      const rrss = "actcargentina";
      const intro = $("body").find(".info p").text() + "\r\n";
      let desc = $("body").find(".circuit-desc div.wrapper p").text();
      desc = desc.split(". ").join("@@");
      desc = desc.split(".0").join("##");
      desc = desc.split(".").join("\r\n");
      desc = desc.split("@@").join(".");
      desc = desc.split("##").join(".0");
      const data = {
        strLeague: $("body").find(".info h2").text().replace("LA ", ""),
        strLogo:
          urlBase +
          $("body").find(".lazy.img-responsive").attr("data-original"),
        strDescriptionEN: intro + desc,
        strDescriptionES: intro + desc,
        strPoster: "",
        strBanner: "",
        strWebsite: urlBase,
        strFacebook: "https://www.facebook.com/" + rrss,
        strTwitter: "https://www.twitter.com/" + rrss,
        strInstagram: "https://www.instagram.com/" + rrss,
        strYoutube: "",
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
      //console.log(pilots);
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
        const circuitImg =
          urlBase + $(el).find(".lazy.img-responsive").attr("data-original");
        const data = {
          dateEvent: date,
          strEvent: name,
          strDescriptionEN: desc,
          strCircuit: desc,
          strThumb: circuitImg,
        };
        dates.push(data);
      });
      //console.log(dates);
    } catch (e) {
      console.log("EVENTS error: " + e);
    }
    return dates;
  }

  async function pilots() {
    const pilots = [];
    try {
      const urlBase = "https://www.actc.org.ar";
      const url = "/pilotos.html";
      const $ = await fetchHTML(urlBase + "/" + cat + url);

      $(".driver-listing ul li a").each((i, el) => {
        const data = {
          strPlayer: $(el).find("h2").text().replace(",", ", "),
          strNumber: $(el).find(".car-data span").text(),
          strTeam: $(el).find(".car-data .team").text(),
          strThumb: urlBase + $(el).find("figure img").attr("data-original"),
          strRender: urlBase + $(el).find("figure img").attr("data-original"),
          strCutout: urlBase + $(el).find("figure img").attr("data-original"),
          strFanart4: urlBase + $(el).find(".logo img").attr("data-original"),
          intLoved: urlBase + $(el).attr("href"),
        };
        pilots.push(data);
      });
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
    try {
      const champs = champ("tc");
      //events("tc"); //  tc | tcp | tcm | tcpm | tcpk
    } finally {
    }
  }
  
  init() */
}
