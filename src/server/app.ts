import {join} from 'path';
import {readFileSync} from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import {BreweryDBService, MysqlDatabase} from './services';

require('dotenv').config();

let DB = new MysqlDatabase();
let BeerAPI = new BreweryDBService(process.env.BREWERY_DB_KEY, DB);

const APP_CONFIG = {
  environment: process.env.ENVIRONMENT || 'dev',
  cookie_name: process.env.COOKIE_NAME || 'ot_auth',
  cookie_secret: process.env.COOKIE_SECRET || 'cookie_secret',
  port: process.env.NODE_PORT || 3000,
  log_level: process.env.MORGAN_LOG_LEVEL || 'dev',
  database: DB,
  beer_service: BeerAPI
};

const app = express();

app.use(bodyParser.json({limit: '100mb'}));
app.use(cookieParser(APP_CONFIG.cookie_secret));

app.use(morgan(APP_CONFIG.log_level));

/*-------- API --------*/
app.use('/api', require('./routes/api')(APP_CONFIG));

/*------- Angular client on Root ------- */
app.set('view engine', 'html');
app.use(express.static(join(__dirname, '../client')));
app.get('/*', function(req, res){
  return res.sendFile(join(__dirname, '../client/index.html'));
});

app.all('*', function(req, res){
  return res.status(404).send('404 UNKNOWN ROUTE');
});

let server;
if (process.env.HTTPS) {
    let ssl_config = {
        key: (process.env.SSLKEY ? readFileSync(process.env.SSLKEY) : undefined),
        cert: (process.env.SSLCERT ? readFileSync(process.env.SSLCERT) : undefined),
        ca: (process.env.SSLCHAIN ? readFileSync(process.env.SSLCHAIN) : undefined),
        pfx: (process.env.SSLPFX ? readFileSync(process.env.SSLPFX) : undefined)
    };
    server = https.createServer(ssl_config, app);
    let redir = express();
    redir.get('*', (req, res, next) => {
      let httpshost = `https://${req.headers.host}${req.url}`;
      return res.redirect(httpshost);
    });
    redir.listen(80);
} else {
    server = app;
}

server.listen(APP_CONFIG.port);
console.log('App started on port', APP_CONFIG.port);
