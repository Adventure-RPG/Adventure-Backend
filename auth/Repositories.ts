/**
 * Created by GolemXIV on 12.06.2017.
 */
import {Repository} from "../game/Repository";
import {User} from "./Model";
import {Storage} from "../game/Storage";
import {Observable} from "rxjs";
import {Specification} from "../game/Specification";
import {List} from "../geojson/models";

export class UserRepository implements Repository<User> {

    constructor(private _storages: [Storage<User>]) {}

    public add(user: User) {
        for (let storage of this._storages) {
            let users = storage.persist(user);
            if (users) {
                return users;
            }
        }
    }

    public remove(user: User) {
        for (let storage of this._storages) {
            storage.delete(user);
        }
    }

    public update(user: User) {
        for (let storage of this._storages) {
            storage.modify(user);
        }
    }

    public query(spec: Specification<User>): Promise<List<User>> {
        for (let storage of this._storages) {
            let features = storage.retrieve(spec);
            if (features) {
                return features;
            }
        }
    }
}
