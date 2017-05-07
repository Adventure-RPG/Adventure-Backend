import {Path, GET, PathParam, QueryParam, POST, PUT, DELETE, ServiceContext, Context, Errors} from "typescript-rest";
import {Feature} from "./Model";
import {AuthRequired} from "../game/Authentication";
import {factory} from "./Factory";
import {ByIdSpecification, BySQLSpecification, ByPointSpecification, BySquareSpecification} from "./Specifications";
import {GeoFeatureList} from "../geojson/models";
import {Identifiable} from "../game/Model";
import {validator} from "../game/Factory";
import {SQLSpecification, Specification} from "../game/Specification";


/**
 * controller Feature
 */

//TODO: написать докеоратор для контролеров используя декоратор пути.
@Path("/points")
export class FeatureController {

    @Context
    context: ServiceContext;

    @GET
    getFeatures(@QueryParam("latitude") latitude?: number,
                @QueryParam("longitude") longitude?: number,
                @QueryParam("altitude") altitude?: number,
                @QueryParam("top") top?: number,
                @QueryParam("left") left?: number,
                @QueryParam("right") right?: number,
                @QueryParam("bottom") bottom?: number,
                @PathParam("id") id?: number): Promise<GeoFeatureList> {
        if (longitude && longitude && altitude) {
            return this.resolve(false, new ByPointSpecification(latitude, longitude, altitude));
        } else if (top && left && right && bottom) {
            return this.resolve(false, new BySquareSpecification(top, left, right, bottom));
        } else {
            return this.resolve(false, new BySQLSpecification());
        }
    }

    @Path(":id")
    @GET
    // /points/
    getFeature(@PathParam("id") id: number): Promise<GeoFeatureList> {
        return this.resolve(true, new ByIdSpecification(id));
    }

    @POST
    addFeature(body) {
        if (!validator.validate(body)) {
            throw new Errors.BadRequestError();
        }
        return factory.repository.add(new Feature(body));
    }

    @Path(":id")
    @PUT
    modifyFeature(@PathParam("id") id: number, body) {
        if (!validator.validate(body)) {
            throw new Errors.BadRequestError();
        }
        body.properties.id = id;
        return factory.repository.update(new Feature(body));
    }

    @Path(":id")
    @DELETE
    deleteFeature(@PathParam("id") id: number) {
        return factory.repository.remove(new Feature(id));
    }

    resolve(single: boolean, spec: SQLSpecification<Feature>) {
        return factory.repository.query(spec).then(
            resolve=> {
                if (resolve && resolve.length) {
                    if (single) {return resolve[0];}
                    return resolve;
                }
                return new Promise((resolve, reject)=> {
                    if (resolve) { return [];}
                    return new Error("Error - services");
                });
            },
            reject => {
                console.log(reject);
                return reject;
            }
        );
    }
}