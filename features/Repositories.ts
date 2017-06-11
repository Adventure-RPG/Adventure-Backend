import {Repository} from "../game/Repository";
import {Feature} from "./Model";
import {Storage} from "../game/Storage";
import {Specification} from "../game/Specification";
import {GeoFeature, GeoFeatureList} from "../geojson/models";

export class FeatureRepository implements Repository<Feature> {

    constructor(private _storages: Array<Storage<Feature>>) {}

    public add(feature: Feature) {
        for (let storage of this._storages) {
            storage.persist(feature);
        }
    }
    public remove(feature: Feature) {
        for (let storage of this._storages) {
            storage.delete(feature);
        }
    }
    public update(feature: Feature) {
        for (let storage of this._storages) {
            storage.modify(feature);
        }
    }
    public query(spec: Specification<Feature>): Promise<GeoFeatureList> {
        for (let storage of this._storages) {
            let features = storage.retrieve(spec);
            if (features) {
                return features;
            }
        }
    }
}
