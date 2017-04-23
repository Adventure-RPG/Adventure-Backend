/**
 * Created by GolemXIV on 26.03.2017.
 */

export function AuthRequired(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value; // save a reference to the original method

    descriptor.value = function(...args: any[]) {
        console.debug("The method args are: " + JSON.stringify(args)); // pre
        let result = originalMethod.apply(this, args);               // run and store the result
        console.debug("The return value is: " + result);               // post
        return result;                                               // return the result of the original method
    };

    return descriptor;
}