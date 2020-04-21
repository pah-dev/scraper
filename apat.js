const cheerio = require("cheerio");
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ(key) {
  const pilots = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/posiciones";
    const $ = await fetchHTML(urlBase + url + "/" + key);

    $("tbody tr.TabResData").each((i, ele) => {
      const el = $(ele).find("td");
      const pos = $(el[0]).text();
      const number = $(el[1]).text();
      const pilot = $(el[2]).find(".desk").text();
      const brand = $(el[3]).text();
      const cups = "";
      const pts = $(el[4]).text().trim();
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
    console.log(pilots);
  } catch (e) {
    console.log(e);
  }
  return pilots;
}

async function imgCircuit(key) {
  let link = "";
  try {
    const url = "";
    const $ = await fetchHTML(url + key);

    link = $(".notimage").find("img").attr("src");
  } catch (e) {
    console.log("ERROR: " + e);
  } finally {
    return link;
  }
}

async function calendar(key) {
  const dates = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url + "/" + key);

    await $("tbody tr").each(async (i, ele) => {
      if (i != 0) {
        const el = $(ele).find("td");
        const date = $(el[1]).text();
        const name = $(el[2]).find("a").text().trim();
        const desc = $(el[2]).find("a").attr("href");
        const uri = $(el[2]).find("a").attr("href");
        const circuit = await imgCircuit(uri);
        const data = {
          date: date,
          name: name,
          desc: desc,
          circuit: circuit,
        };
        dates.push(data);
      }
    });
    console.log("FECHAS");
    console.log(dates);
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  return dates;
}

function init() {
  champ("2"); // 2 | 3
  //calendar("2019"); // year
}

init();
