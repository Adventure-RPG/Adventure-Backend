import * as fs from 'fs';

const fn = __dirname + `/environments/environment.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev' }.json`;
const f = fs.readFileSync(fn, 'utf8');
export const config = JSON.parse(f);

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