var fs = require('fs');
console.log(JSON.parse(fs.readFileSync('src/manifest.json', 'utf8')).version);
