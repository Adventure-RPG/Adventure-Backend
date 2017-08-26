import {Server} from "typescript-rest";
import * as express from "express";
import {Properties} from "ts-json-properties";
import {FeatureController} from "./features/Services";
import {UserService} from "./auth/Services";
import {errorHandler, Logger} from "./game/Errors";

/**
 * Initialize some lib
 */
Properties.initialize();

/**
 * Rest controllers from backend
 */

const Controllers:any = [
    FeatureController,
    UserService,
];

Controllers.map( service => new service());

/**
 * build express application
 * @type {Express}
 */

const app: express.Application = express();
Server.buildServices(app);
app.use(errorHandler);

let logger = new Logger("default");

app.listen(3000, function() {
    logger.log("info", "Rest Server listening on port 3000!");
});
