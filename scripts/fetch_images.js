const https = require('https');
const fs = require('fs');

const url = "https://source.unsplash.com/random/800x600/?architecture,energy,smart-home";

https.get(url, (res) => {
  const file = fs.createWriteStream("data/demo.jpg");
  res.pipe(file);
  console.log("Bild gespeichert: data/demo.jpg");
});
