let i = 0;
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs/promises");
const { image } = require("./saveImage");
const about = async (client) => {
  setInterval(async () => {
    try {
      const { data } = await axios.get(
        "https://tribune.com.pk/weather-updates/islamabad"
      );
      const $ = cheerio.load(data);
      const mainInfo = $(
        "#nav-islamabad > div > div.height-60 > div.date > span"
      ).text();
      const currenTemp = $("#tabs-1").text();
      const minutes = Math.floor(i / 60);
      const hours = Math.floor(minutes / 60);
      const seconds = i % 60;
      const message = `\nDate: ${mainInfo} `;
      const showCase =
        message + `Bot Runtime: ${hours}h:${minutes}m:${seconds}s`;
      // Uncomment the line below if you want to update a profile status
      //  await client.updateProfileStatus(showCase);

      const jid = "923185853847@s.whatsapp.net";
      // console.log("updatede");
      const urlofImage = await image(
        `Sketch. I wish to be alive . Night Colors. Loneliness. Nothing Exists or matter. Ourselves. solitude . Text "Talha". Alone boy.`
      );
      console.log(urlofImage);
      const res = await axios.get(urlofImage, {
        responseType: "arraybuffer",
      });
      await fs.writeFile(`./image${i}.png`, res.data);
      await client.updateProfilePicture(jid, { url: `./image${i}.png` });
      await fs.unlink(`./image${i}.png`);
      i = i + 60; // Increment i by 1 second
    } catch (error) {
      const jid = [
        "923185853847@s.whatsapp.net",
        "923101502365@s.whatsapp.net",
      ];
      jid.forEach(async (id) => {
        try {
          await client.sendMessage(id, { text: error.message });
        } catch (error) {
          client.sendMessage(id, { text: error.message });
        }
        console.log(error);
      });

      console.log(error);
    }
  }, 60000);
};
module.exports = about;
