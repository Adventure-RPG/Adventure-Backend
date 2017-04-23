import {Server, Path, GET, PathParam, POST, PUT, DELETE, ServiceContext, Context} from "typescript-rest";
import {AuthRequired} from "./Authentication";
import {factory} from "../features/Factory";
import {Feature} from "../features/Model";
import {ByIdSpecification} from "../features/Specifications";
import * as express from "express";
import * as winston from "winston";
import {Properties} from 'ts-json-properties';

/**
 * Initialize some lib
 */
Properties.initialize();


/**
 * Rest methods from backend
 */

@Path("points")
class FeatureService {
    @Context
    context: ServiceContext;

    @Path(":id")
    @GET
    getFeature(@PathParam("id") id: number): Promise<Feature> {
        return factory.repository.query(new ByIdSpecification(id));
    }

    @AuthRequired @POST
    addFeature(body) {
        return factory.repository.add(new Feature(body.properties.name, body.geometry));
    }

    @Path(":id")
    @AuthRequired @PUT
    modifyFeature(body) {
        return factory.repository.update(new Feature(body.properties.name, body.geometry));
    }

    @Path(":id")
    @AuthRequired @DELETE
    deleteFeature(@PathParam("id") id: number, body) {
        return factory.repository.remove(new Feature(body.properties.name, body.geometry, id));
    }
}


const app: express.Application = express();
Server.buildServices(app);

app.listen(3000, function() {
    console.info("Rest Server listening on port 3000!");
});
