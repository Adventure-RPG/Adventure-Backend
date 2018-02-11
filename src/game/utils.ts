
export function toPromise<T>(func: any, ...params: any[]): Promise<T> {
    return new Promise(resolve => func(...params, (err, res) => {
        if (err) { throw err; }
        resolve(res);
    }));
}
