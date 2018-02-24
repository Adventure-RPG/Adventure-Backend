import * as fs from 'fs';

export const config = JSON.parse(fs.readFileSync(__dirname + `/environments/${process.env.DEBUG ? 'dev' : 'prod' }/environment.json`, 'utf8'));

export function Config<T>(name: string) {
    return (target: any, propertyKey: string) => {
        if (delete this[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: () => config[name],
                set: () => {},
                enumerable: false,
                configurable: false,
            });
        }
    };
}