import {Path, GET, PathParam, POST, PUT, DELETE, ServiceContext, Context} from "typescript-rest";
import {Feature, FeatureInteface} from "./Model";
import {AuthRequired} from "../game/Authentication";
import {factory} from "./Factory";
import {ByIdSpecification, BySQLSpecification} from "./Specifications";
import {GeoFeatureList} from "../geojson/models";
import {Identifiable} from "../game/Model";

/**
 * controller Feature
 */

//TODO: написать докеоратор для контролеров используя декоратор пути.
@Path("/points")
export class FeatureController {
    @Context
    context: ServiceContext;

    @GET
    getFeatures(): Promise<GeoFeatureList<Feature>> {
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
    getFeature(@PathParam("id") id: number): Promise<GeoFeatureList<Feature>> {
        let promise = factory.repository.query(new ByIdSpecification(id)).then(
            resolve=>{
                if (resolve && resolve.length){
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
        let obj: FeatureInteface = {_name: body.properties.name, _geo: body.geometry};
        return factory.repository.add(new Feature(obj));
    }

    @Path(":id")
    @PUT
    modifyFeature(@PathParam("id") id: number, body) {
        let obj: FeatureInteface = {_name: body.properties.name, _geo: body.geometry, _id: id};
        return factory.repository.update(new Feature(obj));
    }

    @Path(":id")
    @DELETE
    deleteFeature(@PathParam("id") id: number) {
        //TODO: Хоть и урод, но работает.
        //TODO: https://github.com/Microsoft/TypeScript/issues/467 - виноваты они, честно.
        return factory.repository.remove(new Feature({_id: id}));
    }
}