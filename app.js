const { getLyrics, getSong } = require("genius-lyrics-api");
const axios = require("axios");
const getAlbumArt = require("./getArtwork");
const express = require("express");
let port = process.env.PORT;
const app = express();
var data = [];
var promise;

app.get("/", (req, res) => {
  String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\n/g, " ");
  };

  var final = function (callback) {
    axios
      .get(`http://maxfm909.thrilliant.com.ng:9193/currentsong?sid=1`)
      .then((res) => {
        var song = res.data;
        var str = song.split("-");
        console.log(str);
        const options = {
          apiKey:
            "SfurQwmGeVhYqYtaxW_gTJGEp-fq4hdvXYC53ifMjrE_49F52YbGDbZPMrUsjWrl",
          title: `${str[1]}`,
          artist: `${str[0]}`,
          optimizeQuery: true,
        };

        getAlbumArt(`${str[1]} ${str[0]}`, function (response) {
          if (response === "No Image Found") {
            getSong(options).then(function (song) {
              data.push({
                image: song.albumArt,
                songName: str[1],
                songArtist: str[0],
              });
            });
          } else {
            data.push({
              image: response,
              songName: str[1],
              songArtist: str[0],
            });
          }
        });

        getLyrics(options).then(function (lyrics) {
          var myJSONString = JSON.stringify(lyrics);
          var myEscapedJSONString = myJSONString.escapeSpecialChars();
          if (!lyrics) {
            data.push({
              lyrics: "Lyrics Not Available",
            });
          } else {
            data.push({
              lyrics: myEscapedJSONString,
            });
          }
        });

        setTimeout(() => {
          callback(data.reduce((r, c) => Object.assign(r, c), {}));
        }, 6000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  final(function (response) {
    res.send(response);
  });
});

if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => console.log(`App listening on port ${port}!`));
