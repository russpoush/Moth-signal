import {cp,mkdir,readdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const file of await readdir('src'))await cp(`src/${file}`,`dist/${file}`,{recursive:true});
console.log('Built offline app assets.');
