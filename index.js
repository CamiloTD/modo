#!/usr/local/bin/node
const Modo = require('./modo');
const path = require('path');
const fs   = require('fs');

const file = (p) => path.join(process.cwd(), p);

let config = {};

try { config = require(file('modo.json')); } catch (exc) {}

let public_folder = (config.public_folder && path.join(process.cwd(), config.public_folder)) || process.cwd();

(async () => {
    const modo  = new Modo(config);
    const app   = await modo.create();
    const files = fs.readdirSync(public_folder);
    
    files.forEach((f) => {
        try {
            if(f.toLowerCase() !== 'modo.json'){
                let name = f.substring(0, f.lastIndexOf('.'));
                let ext = f.substring(f.lastIndexOf('.')).toLowerCase();

                modo.expose(ext === '.js'? name : f, require(path.join(public_folder, f)));
            }
        } catch (exc) {

        }
    });
    
})();