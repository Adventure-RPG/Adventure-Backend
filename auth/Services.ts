/**
 * Created by GolemXIV on 11.06.2017.
 */
import {Path, POST, GET, PathParam, Return, Errors, ReferencedResource, HttpError} from "typescript-rest";
import {authService} from "./Auth";
import {AcceptResource} from "./Statuses";
import {User} from "./Model";
import {factory} from "./Factory";
import {ByCredentialsSpecification, ByIdSpecification, BySQLSpecification} from "./Specifications";
import {SQLSpecification} from "../game/Specification";
import {List} from "../geojson/models";


@Path("/users")
export class UserService {

    @GET
    getUsers() {
        return this.resolve(false, new BySQLSpecification()).then(resolve=> {
            return new Return.RequestAccepted("", {users: resolve});
        });
    }

    @Path(":id")
    @GET
    // /points/
    getUser(@PathParam("id") id: number): Promise<List<User>> {
        return this.resolve(true, new ByIdSpecification(id));
    }

    @POST
    @Path("/login")
    login(body): Promise<ReferencedResource|HttpError> {
        console.log(`body ${body.email} - ${body.password}`);
        if (body.email && body.password) {
            return this.resolve(true, new ByCredentialsSpecification(body.email, body.password))
            .then(res => {
                console.log(res);
                return authService.createToken(body.email);
            }).then(resolve => {
                console.log(resolve);
                return new Return.NewResource("", {token: resolve});
            }).catch(reject => {
                console.log(reject);
                return new Errors.UnauthorizedError("You're fucked.");
            });
        }
    }

    @POST
    @Path("/register")
    register(body): Promise<ReferencedResource|HttpError> {
        console.log(body);
        return authService.createHash(body.password).then(hash=> {
            let user = new User({email: body.email, username: body.username, password: hash, is_active: false});
            return factory.repository.add(user).toPromise().then(res => {
                console.log("db"+res);
                return authService.createToken(user.email).then(resolve => {
                    console.log(resolve);
                    return new Return.NewResource("", {token: resolve});
                });
            });
        }).catch(reject => {
            console.log(reject);
            return new Errors.BadRequestError("Fucked");
        });
    }

    resolve(single: boolean, spec: SQLSpecification<User>) {
        return factory.repository.query(spec).then(
            resolve=> {
                if (resolve.length > 0) {
                    if (single) {return resolve[0];}
                    return resolve;
                }
                throw new Error("Error - services");
            },
            reject => {
                console.log(reject);
                return new Errors.UnauthorizedError("You're fucked.");
            }
        );
    }
}
