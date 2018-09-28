# Modo
Modo is a simple and lightweigth module for exposing  methods an objects to an HTTP API, it's simple, just run `modo` and it will expose every module in your folder.

#### Installation
Just use `npm install -g @camilotd/modo` and it's done!

#### Using Modo
Modo is developed with simplicity in mind, you can start your service on any folder and it will automatically expose every module inside using: `modo`

You can also define a **modo.json** file for configuring the following options: 
```js
{
	"host": "127.0.0.1", /* Host to expose, for public use 0.0.0.0 */
	"port": 6080,
	"method": "POST", /* GET API with query params or POST JSON API? */
	"debug": true, /* Prints debug output */
	"public_folder": "." /* Folder to be exposed, by default: ./ */
} 
```