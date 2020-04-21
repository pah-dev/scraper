const cheerio = require("cheerio");
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ(key) {
  const pilots = [];
  const brands = [];
  const teams = [];
  const result = [];
  try {
    const urlBase = "https://www." + key + "2000.com.ar/";
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
          const brand = urlBase + $(el).find(".marca img").attr("src");
          const pts = $(el).find(".total").text();
          const data = {
            pos: pos,
            number: number,
            pilot: pilot,
            cups: cups,
            brand: brand,
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
    console.log(pilots);
    console.log(teams);
    console.log(brands);

    result.push(pilots);
    //result.push(teams);
    result.push(brands);
  } catch (e) {
    console.log(e);
  }
  return result;
}

async function calendar(key) {
  const dates = [];
  try {
    const urlBase = "https://www." + key + "2000.com.ar/";
    const url = "/carreras.php?evento=calendario";
    const $ = await fetchHTML(urlBase + "/" + url);

    $(".box-fechas").each((i, el) => {
      const date = $(el).find("span.gris").text();
      const name = $(el).find("h3").text();
      const desc = "";
      const circuit =
        (key == "" ? urlBase : "") +
        $(el).find(".imagen_autodromo").attr("src");
      const data = {
        date: date,
        name: name,
        desc: desc,
        circuit: circuit,
      };
      dates.push(data);
    });

    console.log(dates);
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  return dates;
}

function init() {
  champ("tc");
  calendar(""); //  "tc" | supertc
}

init();
