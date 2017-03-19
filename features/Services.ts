import {Path, GET, PathParam, POST, PUT, DELETE, ServiceContext, Context} from "typescript-rest";
import {Feature} from "./Model";
import {AuthRequired} from "../game/Authentication";
import {factory} from "./Factory";
import {ByIdSpecification} from "./Specifications";

@Path("points")
export class FeatureService {
    @Context
    context: ServiceContext;

    @Path(":id")
    @AuthRequired @GET
    getFeature(@PathParam("id") id: number): Promise<Feature> {
        return factory.repository.query(new ByIdSpecification(id));
    }

    @AuthRequired
    @POST
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
