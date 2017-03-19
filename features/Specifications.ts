import {SQLSpecification} from "../game/Specification";
import {Feature} from "./Model";

abstract class BySQLSpecification implements SQLSpecification<Feature> {
    public abstract specified(T): boolean

    public toSqlClause(): string {
        return "SELECT ST_AsGeoJSON(lg.geo)::json As geometry, row_to_json(lp) As properties FROM points As lg " +
            "INNER JOIN (SELECT id, name from points) As lp ON lg.id = lp.id ";
    }

}

export class ByIdSpecification extends BySQLSpecification implements SQLSpecification<Feature> {

    constructor(private _id) { super(); }

    public specified(feature) {
        return this._id === feature.id;
    }

    public toSqlClause() {
        return super.toSqlClause() + "WHERE lg.id = ${this._id};";
    }
}

export class ByPointSpecification extends BySQLSpecification implements SQLSpecification<Feature> {
    constructor(private _latitude: number, private _longitude: number, private _altitude: number) { super(); }

    public specified(feature) {
        return feature.inPoint(this._latitude, this._longitude, this._altitude);
    }

    public toSqlClause() {
        return super.toSqlClause() + " WHERE ST_Contains(lg.geo, " +
            "ST_GeomFromText('POINT(${this._latitude} ${this._longitude} $(this._altitude})');";
    }
}

export class BySquareSpecification extends BySQLSpecification implements SQLSpecification<Feature> {
    constructor(private _top, private _left, private _right, private _bottom) { super(); }

    public specified(feature): boolean {
        return feature.inSquare(this._top, this._left, this._right, this._bottom);
    }
    public toSqlClause() {
        return super.toSqlClause() + " WHERE lg.geo && " +
            "BOX3D(${this._top}, ${this._left}, ${this._right}, ${this._bottom})::box3d);";
    }
}