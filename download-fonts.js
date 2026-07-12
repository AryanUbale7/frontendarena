const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, 'public', 'fonts');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const downloadFont = (fontFamily, cssUrl, filename) => {
  https.get(cssUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      // Regex matches woff2 url, handles optional https prefix or leading double slashes
      const match = data.match(/url\(['"]?(?:https:)?(\/\/cdn\.fontshare\.com\/[^'"\)]+\.woff2)['"]?\)/);
      if (match && match[1]) {
        const woff2Url = 'https:' + match[1];
        console.log(`Downloading ${fontFamily} from ${woff2Url}`);
        const file = fs.createWriteStream(path.join(fontsDir, filename));
        https.get(woff2Url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Successfully downloaded ${filename}`);
          });
        });
      } else {
        console.error(`Could not find woff2 url for ${fontFamily}`);
      }
    });
  });
};

downloadFont('Clash Display', 'https://api.fontshare.com/v2/css?f[]=clash-display@1', 'ClashDisplay-Variable.woff2');
downloadFont('General Sans', 'https://api.fontshare.com/v2/css?f[]=general-sans@1', 'GeneralSans-Variable.woff2');
