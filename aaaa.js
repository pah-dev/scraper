/* const convert = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countries = await getCountries(toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);
  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. 
     You can spend these in the following countries: ${countries}`;
};

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(
      "http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1"
    );
    const rate = response.data.rates;
    const euro = 1 / rate[fromCurrency];
    const exchangeRate = euro * rate[toCurrency];
    return exchangeRate;
  } catch (error) {
    throw new Error(
      `Unable to get currency ${fromCurrency} and  ${toCurrency}`
    );
  }
};

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${currencyCode}`
    );
    return response.data.map((country) => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

convertCurrency("USD", "HRK", 20)
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error.message);
  });
 */
const cheerio = require("cheerio");
const axios = require("axios");

const fetchHTML = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

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
          console.log(link);
          element["strThumb"] = link;
          console.log(element["strThumb"]);
        }
      }
    }
    return data;
  } catch (e) {
    console.log("ERROR: " + e);
  }
};

const getEvents = async (year) => {
  const newdata = [];
  let result;
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url + "/" + year);
    $("tbody tr").each((i, ele) => {
      if (i != 0) {
        const el = $(ele).find("td");
        newdata[i] = {
          intRound: newdata.length + 1,
          dateEvent: $(el[1]).text(),
          strEvent: $(el[2]).text().trim(),
          strDescriptionEN: "",
          strCircuit: "",
          strThumb: "",
          strTweet1: $(el[2]).find("a").attr("href"),
        };
      }
    });
    result = await getImgCircuit(newdata);
    console.log(result);
  } catch (error) {
    throw new Error(`Unable to get currency` + error);
  }
};

getEvents(2020)
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.log(error.message);
  });

/* 
async function events2() {
  const newdata = [];
  try {
    const urlBase = "https://www.apat.org.ar/";
    const url = "/calendario";
    const $ = await fetchHTML(urlBase + url + "/" + year);
    await $("tbody tr").each(async (i, ele) => {
      if (i != 0) {
        const el = $(ele).find("td");
        let link = "";
        let uri = $(el[2]).find("a").attr("href");
        getImg(uri, async function (uri) {
          if (uri) {
            const $2 = await fetchHTML(uri ? uri : "");
            console.log("consulta");
            link = $2(".notimage").find("img").attr("src");
          }
        });
        newdata[i] = {
          dateEvent: $(el[1]).text(),
          strEvent: $(el[2]).text().trim(),
          strDescriptionEN: "",
          strCircuit: "",
          strThumb: link,
        };
        /* 
          const el = $(ele).find("td");
          const date = $(el[1]).text();
          const name = $(el[2]).text().trim();
          const desc = "";
          const uri = $(el[2]).find("a").attr("href");
          var circuitImg = "";
          if (uri) {
            const $2 = await fetchHTML(uri ? uri : "");
            console.log("consulta");
            circuitImg = await $2(".notimage").find("img").attr("src");
          }
          console.log(circuitImg);
          const data = {
            dateEvent: date,
            strEvent: name,
            strDescriptionEN: desc,
            strCircuit: desc,
            strThumb: circuitImg,
          };
          dates.push(data); 
      }
    });
  } catch (e) {
    console.log("CALENDAR error: " + e);
  }
  console.log(newdata);

  return newdata;
}
 */
