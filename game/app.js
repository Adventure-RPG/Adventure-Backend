import { Server } from "typescript-rest";
import * as express from "express";
import * as winston from "winston";
import { FeatureService } from "../features/Services";
const app = express();
Server.buildServices(app);
const featureService = new FeatureService();
app.listen(3000, function () {
    winston.info("Rest Server listening on port 3000!");
});
//# sourceMappingURL=app.js.map