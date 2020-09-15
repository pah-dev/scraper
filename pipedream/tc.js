if (steps.init.org == "tc") {
  const cheerio = require("cheerio");
  const axios = require("axios");

  let typ = steps.init.typ;
  let cat = steps.init.cat;
  let year = steps.init.year;
  let ext = steps.init.ext;

  async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  }

  async function champ() {
    const pilots = [];
    const brands = [];
    const teams = [];
    let result = [];
    try {
      const urlBase =
        cat == "f20r"
          ? "https://www.formulas-argentinas.com.ar/"
          : "https://www." + cat + "2000.com.ar/";
      const url = "/estadisticas.php?accion=posiciones";
      const $ = await fetchHTML(urlBase + "/" + url);

      for (let i = 1; i < 4; i++) {
        const tab = $("div#tabs-" + i);
        $(tab)
          .find(".puntajes")
          .each((j, el) => {
            const pos = $(el).find(".posicion").text().replace("°", "");
            const number = "";
            const pilot = $(el).find(".piloto").text();
            const cups = "";
            const brand = $(el).find(".marca img").attr("alt");
            const brandLogo = urlBase + $(el).find(".marca img").attr("src");
            const pts = $(el).find(".total").text();
            const data = {
              pos: pos,
              number: number,
              pilot: pilot,
              cups: cups,
              brand: brand,
              brandLogo: brandLogo,
              pts: pts,
            };
            if (i == 1) {
              pilots.push(data);
            } else if (i == 2) {
              teams.push(data);
            } else {
              brands.push(data);
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
    if (ext == "t") {
      return teams;
    } else if (ext == "b") {
      return brands;
    } else if (ext == "") {
      return pilots;
    }
  }

  async function events() {
    const dates = [];
    try {
      const urlBase =
        cat == "f20r"
          ? "https://www.formulas-argentinas.com.ar/"
          : "https://www." + cat + "2000.com.ar/";
      const url = "/carreras.php?evento=calendario";
      const $ = await fetchHTML(urlBase + "/" + url);

      $(".box-fechas").each((i, el) => {
        const date = $(el).find("span.gris").text();
        const name = $(el).find("h3").text();
        const desc = "";
        const circuitImg =
          (cat != "supertc" ? urlBase : "") +
          $(el).find(".imagen_autodromo").attr("src");
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
      console.log("CALENDAR error: " + e);
    }
    return dates;
  }

  async function pilots() {
    const pilots = [];
    try {
      const urlBase =
        cat == "f20r"
          ? "https://www.formulas-argentinas.com.ar/"
          : "https://www." + cat + "2000.com.ar/";
      const url = "equipos.php?accion=pilotos";
      const $ = await fetchHTML(urlBase + "/" + url);
      const link = urlBase; //cat != "supertc" ? urlBase : "";
      $(".col-md-4.col-sm-6.col-xs-12.m_t_15").each((i, ele) => {
        const data = {
          strPlayer: $(ele).find("div.overlay p").text(),
          strNumber: $(ele).find("div.overlay h3").text(),
          strTeam: "",
          strTeam2: $(ele)
            .find("div.overlay h3.imagen_marca img")
            .attr("title"),
          dateBorn: "",
          strBirthLocation: "",
          strSide: "",
          strAgent: $(ele).find("img").attr("title"),
          strThumb: link + $(ele).find("img").attr("src"),
          strRender: link + $(ele).find("img").attr("src"),
          strCutout: link + $(ele).find("img").attr("src"),
          strFanart4: $(ele).find("div.overlay h3.imagen_marca img").attr("src")
            ? link + $(ele).find("div.overlay h3.imagen_marca img").attr("src")
            : "",
          intLoved: $(ele).find("a").attr("href")
            ? link + $(ele).find("a").attr("href")
            : "",
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

  /*  function init() {
    champ("tc");
    events(""); //  "tc" | supertc
  }

  init(); */
}
