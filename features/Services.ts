import {Path, GET, PathParam, POST, PUT, DELETE, ServiceContext, Context, Errors} from "typescript-rest";
import {Feature} from "./Model";
import {AuthRequired} from "../game/Authentication";
import {factory} from "./Factory";
import {ByIdSpecification, BySQLSpecification} from "./Specifications";
import {GeoFeatureList} from "../geojson/models";
import {Identifiable} from "../game/Model";
import {validator} from "../game/Factory";

/**
 * controller Feature
 */

//TODO: написать докеоратор для контролеров используя декоратор пути.
@Path("/points")
export class FeatureController {

    @Context
    context: ServiceContext;

    @GET
    getFeatures(): Promise<GeoFeatureList> {
        let promise = factory.repository.query(new BySQLSpecification()).then(
            resolve=>{
                return resolve;
            },
            reject =>{
                console.log(reject);
                return reject;
            }
        );
        return promise;
    }

    @Path(":id")
    @GET
    getFeature(@PathParam("id") id: number): Promise<GeoFeatureList> {
        let promise = factory.repository.query(new ByIdSpecification(id)).then(
            resolve=> {
                if (resolve && resolve.length) {
                    return resolve[0]
                }
                return new Promise((resolve, reject)=>{
                    if (resolve){
                        return [];
                    }

                    return new Error('error - services');
                });
            },
            reject =>{
                console.log(reject);
                return reject;
            }
        );
        return promise;
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
}