const cheerio = require("cheerio");
const axios = require("axios");
const { createWorker } = require("tesseract.js");

let typ = "";
let cat = "supertc";
let year = "2020";

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

function compare(a, b) {
  return a < b ? -1 : 1;
}

async function teams1() {
  const teams = [];
  try {
    if (cat === "uyst") {
      const urlBase = "http://superturismo.com.uy/";
      const url = "equipos";
      const $ = await fetchHTML(urlBase + url);
      $(".equipos-content div article").each((i, ele) => {
        const data = {
          strLeague: "",
          strTeam: "",
          strTeamBadge: $(ele)
            .find("img")
            .attr("src")
            .replace(".jpg", "-300x189.jpg"),
          strTeamLogo: "",
          strTeamFanart4: $(ele).find("img").attr("src"),
          intLoved: $(ele).find("a").attr("href"),
        };
        teams.push(data);
      });
    }
    console.log(teams);
  } catch (e) {
    console.log(e);
  }
  return teams;
}

async function info() {
  const info = [];
  try {
    const urlBase = "http://www.19capitaleshistorico.com/";
    const url = "historia-del-gpu";
    const $ = await fetchHTML(urlBase + url);
    const rrss = $("body").find(".mainNav.cfx ul li a");
    const imgs = $("body").find(".cfx.historia div.cfx img");
    let desc = "";
    $("body")
      .find(".cfx.historia p")
      .each((i, ele) => {
        desc = desc + "\n" + $(ele).text();
      }); /* 
    desc = desc.split(".0").join("##");
    desc = desc.split(".").join("\r\n");
    desc = desc.split("@@").join(".");
    desc = desc.split("##").join(".0"); */
    const data = {
      strLeague: "Gran Premio 19 Capitales",
      strLogo: $("body").find("a.logo img").attr("src"),
      strDescriptionEN: desc,
      strDescriptionES: desc,
      strPoster: $(imgs[1]).attr("src"),
      strBanner: $("footer").find("div img").attr("src"),
      strWebsite: urlBase,
      strFacebook: $(rrss[rrss.length - 1]).attr("href"),
      strTwitter: "",
      strInstagram: "",
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

async function events() {
  const dates = [];
  try {
    const urlBase = "http://www.19capitaleshistorico.com/";
    const url = "edicion/" + year + "/rutas-y-etapas";
    const $ = await fetchHTML(urlBase + url);
    $(".panel-container.cfx").each((i, ele) => {
      const ps = $(ele).find(".table-min tbody tr td p");
      const ruta = $(ele).find(".grid_7 ul div.cfx p");
      dates.push({
        idEvent: dates.length + 1,
        dateEvent: $(ps[0]).text(),
        strEvent: $(ele).find("h3").text() + " - " + $(ps[3]).text(),
        strDescriptionEN: "",
        strCircuit: $(ruta[0]).text(),
        strThumb: $(ele).find("a img").attr("src"),
      });
    });
    console.log(dates);
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  return dates;
}

async function pilots() {
  const pilots = [];
  let pilotsOrd = [];
  try {
    const urlBase = "http://www.19capitaleshistorico.com/";
    const url = "edicion/" + year + "/lista-de-inscriptos";
    const $ = await fetchHTML(urlBase + url);

    $("tbody tr").each((i, ele) => {
      if (i > 1) {
      }
      const el = $(ele).find("td");
      const data = {
        strPlayer: $(el[1]).text() + " / " + $(el[3]).text(),
        strNumber: $(el[7]).text(),
        strTeam:
          $(el[4]).text() + " " + $(el[5]).text() + " " + $(el[6]).text(),
        strThumb: "",
        strRender: "",
        strCutout: "",
        strFanart4: "A" < "C",
        intLoved: "",
      };
      pilots.push(data);
    });
    pilots.sort((a, b) => {
      return compare(a.strNumber, b.strNumber);
    });
    console.log(pilots);
  } catch (e) {
    console.log(e);
  }
  return pilotsOrd;
}

async function teams() {
  const teams = [];
  try {
    const urlBase =
      cat == "f20r"
        ? "https://www.formulas-argentinas.com.ar/"
        : "https://www." + cat + "2000.com.ar/";
    const url = "equipos.php?accion=pilotos";
    const $ = await fetchHTML(urlBase + "/" + url);
    const link = urlBase; //cat != "supertc" ? urlBase : "";
    $(".col-md-4.col-sm-6.col-xs-12.m_t_15").each((i, ele) => {
      if ($(ele).find("div.overlay h3.imagen_marca img").attr("src")) {
        const data = {
          strTeam: $(ele).find("div.overlay p").text().trim(),
          strTeamLogo:
            link + $(ele).find("div.overlay h3.imagen_marca img").attr("src"),
          strGender: $(ele)
            .find("div.overlay h3.imagen_marca img")
            .attr("title"),
          strAgent: $(ele).find("img").attr("title").trim(),
          strThumb: link + $(ele).find("img").attr("src"),
          strRender: link + $(ele).find("img").attr("src"),
          strCutout: link + $(ele).find("img").attr("src"),
          strFanart4:
            link + $(ele).find("div.overlay h3.imagen_marca img").attr("src"),
          intLoved: "",
        };
        teams.push(data);
      }
    });
    console.log(teams);
  } catch (e) {
    console.log(e);
  }
  return teams;
}

function init() {
  //getTextFromImage();
  //champ(); // 2 | 3
  //events(); // year
  //pilots();
  //info();
  teams();
}

init();
