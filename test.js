const cheerio = require("cheerio");
const axios = require("axios");

let typ = "";
let cat = "uyse";
let year = "";

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ() {
  const data = [];
  try {
    const urlBase = "http://www.motoresenpunta.com/";
    const url = "";
    const $ = await fetchHTML(urlBase + url);
    let table = "";
    if (cat == "uyst") {
      table = "1";
    }
    if (cat == "uyse") {
      table = "2";
    }
    $(".tablepress.tablepress-id-" + table + " tbody tr").each((i, ele) => {
      if (i != 0) {
        const el = $(ele).find("td");
        data.push({
          pos: $(el[0]).text(),
          number: "",
          pilot: $(el[1]).text().trim(),
          cups: "",
          brand: "",
          brandLogo: "",
          pts: $(el[2]).text().trim(),
          diff: "",
          lastre: "",
        });
      }
    });
    console.log(data);
  } catch (e) {
    //console.log(e);
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
    console.log(dates);
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  return dates;
}

function init() {
  champ(); // 2 | 3
  //events(); // year
}

init();
