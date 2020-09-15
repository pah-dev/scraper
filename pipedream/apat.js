//if (steps.init.org == "apat") {
const cheerio = require("cheerio");
const axios = require("axios");
/* 
  let typ = steps.init.typ;
  let cat = steps.init.cat;
  let year = steps.init.year;
 */
let typ = "events";
let cat = "2";
let year = "2020";

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function champ() {
  const pilots = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/posiciones";
    const $ = await fetchHTML(urlBase + url + "/" + cat);

    $("tbody tr.TabResData").each((i, ele) => {
      const el = $(ele).find("td");
      const pos = $(el[0]).text();
      const number = $(el[1]).text();
      const pilot = $(el[2]).find(".desk").text();
      const brand = $(el[3]).text();
      const brandLogo = "";
      const cups = "";
      const pts = $(el[4]).text().trim();
      const diff = $(el[5]).text().trim();
      const lastre = $(el[6]).text().trim();
      const data = {
        pos: pos,
        number: number,
        pilot: pilot,
        cups: cups,
        brand: brand,
        brandLogo: brandLogo,
        pts: pts,
        diff: diff,
        lastre: lastre,
      };
      pilots.push(data);
    });
    console.log(pilots);
  } catch (e) {
    console.log(e);
  }
  return pilots;
}

const getImgCircuit = async (data) => {
  let newdata = [];
  try {
    let link = "";
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element && element.hasOwnProperty("strTweet1")) {
        if (element["strTweet1"] === undefined) {
        } else {
          const $ = await fetchHTML(element["strTweet1"]);
          link = await $(".notimage").find("img").attr("src");
          element["strThumb"] = link;
        }
      }
    }
    return data;
  } catch (e) {
    console.log("ERROR: " + e);
  }
};

async function events() {
  const newdata = [];
  let result;
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url + "/" + year);
    $("tbody tr").each((i, ele) => {
      if (i != 0) {
        const el = $(ele).find("td");
        newdata.push({
          intRound: newdata.length + 1,
          dateEvent: $(el[1]).text(),
          strEvent: $(el[2]).text().trim(),
          strDescriptionEN: "",
          strCircuit: "",
          strThumb: "",
          strTweet1: $(el[2]).find("a").attr("href"),
        });
      }
    });
    result = await getImgCircuit(newdata);
    console.log(result);
  } catch (error) {
    throw new Error(`ERROR Events: ` + error);
  }
}

async function navigate($, url, img, data) {
  let dataAux = [];
  if (img) {
    let link = "";
    let name = "";
    if (url === String) {
      const $2 = await fetchHTML(url);
      link = $2(".notimage").find("img").attr("src");
      name = $[2].children[1].children[0].data.trim();
    } else {
      name = $[2].children[0].data.trim();
    }
    data.push({
      intRound: data.length + 1,
      dateEvent: $[1].children[0].data.trim(),
      strEvent: name,
      strDescriptionEN: "",
      strCircuit: "",
      strThumb: link,
    });
    return data;
  } else {
    $("tbody tr").each(async (i, ele) => {
      if (i != 0) {
        const el = $(ele).find("td");
        let uri = $(el[2]).find("a").attr("href");
        dataAux = await navigate(el, uri, true, dataAux);
      }
    });
    return dataAux;
  }
}

async function events2() {
  let newdata = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url + "/" + year);
    newdata = await navigate($, urlBase + url + "/" + year, false, newdata);
    console.log("DATA: ");
    console.log(newdata);
    return newdata;
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
}

const getImgCircuit1 = async (url) => {
  try {
    let link = "";
    if (url === undefined) {
    } else {
      const $ = await fetchHTML(url);
      link = await $(".notimage").find("img").attr("src");
    }
    return link;
  } catch (e) {
    console.log("ERROR: " + e);
  }
};

async function events1() {
  const newdata = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url + "/" + year);
    await Promise.All(
      $("tbody tr").each(async (i, ele) => {
        //if (i !== 0) {
        try {
          const el = $(ele).find("td");
          const uri = $(el[2]).find("a").attr("href");
          const circuitImg = await Promise.All(
            getImgCircuit(uri).then((link) => {
              newdata[i] = {
                intRound: newdata.length + 1,
                dateEvent: $(el[1]).text(),
                strEvent: $(el[2]).text().trim(),
                strDescriptionEN: "",
                strCircuit: "",
                strThumb: link,
              };
              //console.log(newdata);
            })
          );
          //}
        } catch (error) {}
      })
    );
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  console.log(newdata);
  return newdata;
}

async function pilots() {
  const pilots = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/pilotoslistado";
    const $ = await fetchHTML(urlBase + url + "/" + cat);

    $("wpb_wrapper vc_figure").each((i, ele) => {
      const el = $(ele).find("td");
      let longName = $(el[1]).text().replace("  ", "@").split("@");
      let name = longName[0];
      longName = longName[1].trim().replace("  ", "@").split("@");
      let team = longName[0];
      let lastre =
        $(el[4]).text().trim() != "" ? "Lastre: " + $(el[4]).text().trim() : "";
      const data = {
        strPlayer: name.trim(),
        strNumber: $(el[2]).text().trim(),
        strTeam: team.trim(),
        strTeam2: $(el[5]).text().trim(),
        dateBorn: $(el[8]).text().trim(),
        strBirthLocation: longName[1] ? longName[1].trim() : "",
        strSide: lastre,
        strThumb: $(el[0]).find("img").attr("src"),
        strRender: $(el[0]).find("img").attr("src"),
        strCutout: $(el[0]).find("img").attr("src"),
        strFanart4: "",
        intLoved: "",
      };
      pilots.push(data);
    });
    console.log(pilots);
  } catch (e) {
    console.log(e);
  }
  return pilots;
}

/* 
  var result;
  if (typ == "champ") {
    this.result = await champ();
  } else if (typ == "events") {
    this.result = await events();
  } else {
    this.result = "Default response: " + cat + " - " + typ;
  }
 */

function init() {
  //champ(); // 2 | 3
  events(); // year
}

init();

//}
