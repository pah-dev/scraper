const cheerio = require("cheerio");
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ(key) {
  const pilots = [];
  try {
    const urlBase = "https://www.toprace.com.ar/";
    const url = "/campeonato-general.html";
    /*     const $ = await request({
      url: urlBase + "/" + key + url,
      transform: (body) => cheerio.load(body),
    });
 */
    const $ = await fetchHTML(urlBase + "/" + key + url);

    $("tbody tr").each((i, el) => {
      const pos = $(el).find("td span.label.label-danger").text();
      const number = $(el).find("td").next().html();
      const pilot = $(el).find("td a").text();
      const brand = urlBase + $(el).find("td img").attr("src");
      const cups = $(el).find("td img").next().text();
      const pts = $(el).find("td span.label.label-red").text();
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

async function calendar(key) {
  const dates = [];
  try {
    const urlBase = "https://www.toprace.com.ar";
    const url = "/calendario.html";
    /* const $ = await request({
      url: urlBase + "/" + key + url,
      transform: (body) => cheerio.load(body),
    }); */
    const $ = await fetchHTML(urlBase + "/" + key + url);

    $(".day-item").each((i, el) => {
      const date = $(el).find("div h5.mb0").text();
      const name = $(el).find("div.circuit-title h2").text();
      const desc = $(el).find(".circuit-name").text();
      const circuit = urlBase + $(el).find(".pilot-thumb").attr("src");
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
  champ("toprace");
  calendar("toprace"); // toprace | trseries | trjunior
}

init();
