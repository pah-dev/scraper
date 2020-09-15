var Tesseract = require("tesseract.js");
const { createWorker } = require("tesseract.js");
var request = require("request");
var fs = require("fs");
var url =
  "http://www.motoresenpunta.com/wp-content/uploads/2019/08/sonic-mt.png";
var filename = "pic.png";

var writeFile = fs.createWriteStream(filename);

const worker = createWorker();

request(url)
  .pipe(writeFile)
  .on("close", async function () {
    console.log(url, "saved to", filename);

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {
      data: { text },
    } = await worker.recognize(filename);

    await worker.terminate();
    console.log(text);
  });
