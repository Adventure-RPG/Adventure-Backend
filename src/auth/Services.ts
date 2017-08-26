/**
 * Created by GolemXIV on 11.06.2017.
 */
import {Path, POST, GET, PathParam, ReferencedResource, HttpError} from "typescript-rest";
import {Value} from "ts-json-properties";
import {authService} from "./Auth";
import {AcceptResource, BadRequestError, CreateResource, UnAuthorized} from "./Statuses";
import {RegisterCredentials, User, UserData, userFactory} from "./Model";
import {factory} from "./Factory";
import {ByCredentialsSpecification, ByIdSpecification, BySQLSpecification} from "./Specifications";
import {SQLSpecification} from "../game/Specification";
import {List} from "../geojson/models";
import {Logger} from "../game/Errors";

@Path("/users")
export class UserService {
    private _logger: Logger;

    @Value("messages.users")
    private _messages;

    constructor() {
        this._logger = new Logger("users");
    }

    @GET
    getUsers() {
        return this.resolve(false, new BySQLSpecification()).then(resolve=> {
            return new AcceptResource({users: resolve});
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
        if (body.email && body.password) {
            return this.resolve(true, new ByCredentialsSpecification(body.email, body.password))
            .then(res => authService.createToken(body.email))
            .then(resolve => new AcceptResource({token: resolve}))
            .catch(err => {
                this._logger.error(this._messages.errors.USER_BAD_LOGIN_ERROR, err.message, err);
                throw new BadRequestError(this._messages.errors.USER_BAD_LOGIN_ERROR);
            });
        }
    }

    @POST
    @Path("/register")
    register(body: RegisterCredentials): Promise<ReferencedResource|HttpError> {
        if (!body) { throw new BadRequestError(this._messages.errors.USER_EMPTY_PAYLOAD_ERROR.message); }

        return authService.createPassword(body.password).then(hash=> {
            body.password = hash;
            let data: UserData = Object.assign(userFactory.getInitialData(), body);
            let user = userFactory.createUser(data);
            return factory.repository.add(user).toPromise().then(res => {
                return authService.createToken({email: user.email}).then(resolve => {
                    return new CreateResource({token: resolve});
                });
            });
        }).catch(err => {
            this._logger.error(this._messages.errors.USER_BAD_REGISTER_ERROR, err.message, err);
            throw new BadRequestError(this._messages.errors.USER_BAD_REGISTER_ERROR);
        });
    }

    resolve(single: boolean, spec: SQLSpecification<User>): Promise<User> {
        return factory.repository.query(spec).then(
            resolve=> {
                if (resolve.length > 0) {
                    if (single) {return resolve[0];}
                }
                return resolve;
            },
        ).catch(err => {
            this._logger.error(this._messages.errors.USER_RETRIEVE_ERROR, err.message, err);
            throw new BadRequestError(this._messages.errors.USER_RETRIEVE_ERROR);
        });
    }
}
