let express = require('express');
let body_parser = require('body-parser');
let colors = require('colors/safe');

class Modo {

    constructor (config, app) {
        let port = config.port || 6080;
        let host = config.host || '127.0.0.1';
        let timeout = config.timeout || 5000;
        let debug   = config.debug === undefined? true: config.debug;
        let method  = config.method || 'POST';

        this.app    = app || express();
        this.config = { port, host, timeout, debug, method };
    }

    host () {
        return `http://${this.config.host}:${this.config.port}`;
    }

    create () {
        let { app, config } = this;
        let { port, timeout } = config;
        
        app.use(body_parser.urlencoded({ extended: false }));
        app.use(body_parser.json());

        return new Promise((done, err) => {
            let timer = setTimeout(() => {
                this.print(colors.red("Server creation timed out."));
                err('TIMEOUT');
            }, timeout);

            let server = app.listen(port, () => {
                clearTimeout(timer);
                this.print(`Server running at port ${ colors.cyan(this.host()) }.`);
                
                done(app);
            });
        });
    }

    expose (name, element) {
        switch(typeof element) {
            case 'function': return this.exposeMethod(name, element);
            case 'object'  : return this.exposeObject(name, element);
            default: return this.exposeConstant(name, element);
        }
    }

    exposeObject (name, element) {
        for(let i in element)
            this.expose(`${name}/${i}`, element[i]);
        
        this.exposeConstant(name, element);
    }

    exposeMethod (method_name, fn) {
        this.on(`/${method_name}`, async(rq, rs, data) => {
            try {
                rs.json(await fn(data));
            } catch (exc) {
                rs.status(500).json(exc);
            }
        });

        this.print(colors.yellow(this.config.method), colors.cyan(`${this.host()}/${method_name}`), 'method exposed.')
    }

    exposeConstant (name, element) {
        this.on(`/${name}`, async(rq, rs) => rs.json(element));
        this.print(colors.yellow(this.config.method), colors.cyan(`${this.host()}/${name}`), 'constant exposed.')
    }

    print (...args) {
        if(this.config.debug)
            console.log(...args);
    }

    on (name, fn) {
        if(this.config.method === 'POST')     this.app.post(name, (rq, rs) => fn(rq, rs, rq.data))
        else if(this.config.method === 'GET') this.app.get (name, (rq, rs) => fn(rq, rs, rq.query))
    }
}

module.exports = Modo;