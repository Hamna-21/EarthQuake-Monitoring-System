const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/server.cjs', "require('tsx/cjs');\nrequire('../server.ts');\n");
console.log('Server runtime written to dist/server.cjs');
