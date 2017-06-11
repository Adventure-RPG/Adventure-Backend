/**
 * Created by GolemXIV on 11.06.2017.
 */
import {Path, GET, PathParam, QueryParam, POST, PUT, DELETE, ServiceContext, Context, Errors} from "typescript-rest";
import {User} from "./Model";
import {Observable} from "rxjs";
import {GeoFeatureList} from "../geojson/models";
import {Identifiable} from "../game/Model";
import {validator} from "../game/Factory";
import {} from "jsonwebtoken";
import {authService} from "./Auth";

@Path("/users")
export class UserService {
    @POST
    @Path("/login")
    login(body): Promise<string> {
        if (body.email && body.password) {
            return authService.createToken(body.email).then(resolve => {
                return resolve;
            }, reject => {
                throw new Errors.UnauthorizedError();
            });
        }
    }
}