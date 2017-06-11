/**
 * Created by GolemXIV on 11.06.2017.
 */
import {Path, GET, PathParam, QueryParam, POST, PUT, DELETE, ServiceContext, Context, Errors} from "typescript-rest";
import {User} from "./Model";
import {GeoFeatureList} from "../geojson/models";
import {Identifiable} from "../game/Model";
import {validator} from "../game/Factory";
import {} from "jsonwebtoken";

@Path("/users")
export class UserService {
    @POST
    @Path("/login")
    login(body) {
        if (body.email && body.password) {

        }

    }
}