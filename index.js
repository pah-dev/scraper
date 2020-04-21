const cheerio = require("cheerio");
const request = require("request-promise");

async function champ(key) {
  try {
    const urlBase = "https://www.toprace.com.ar/";
    const url = "/campeonato-general.html";
    const $ = await request({
      url: urlBase + "/" + key + url,
      transform: (body) => cheerio.load(body),
    });

    const pilots = [];

    $("tbody tr").each((i, el) => {
      //console.log($(el).html());
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
}

async function calendar(key) {
  try {
    const urlBase = "https://www.toprace.com.ar";
    const url = "/calendario.html";
    const $ = await request({
      url: urlBase + "/" + key + url,
      transform: (body) => cheerio.load(body),
    });
    //console.log($);

    const dates = [];

    $(".day-item").each((i, el) => {
      //console.log($(el).html());
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
}

function init() {
  champ("trseries");
  //calendar("trjunior"); // toprace | trseries | trjunior
}

init();
