import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','app.mjs','morse.mjs','night.mjs'])await copyFile(`src/${file}`,`dist/${file}`);
