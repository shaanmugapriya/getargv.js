import { TextEncoding, TextDecoderOptions, GetArgv } from './types';

const addon: GetArgv = require('../build/Release/getargv_native');

addon.as_string = function as_string(pid: number, encoding: TextEncoding, nuls?: boolean, skip?: number, options?: TextDecoderOptions): string {
    switch (arguments.length) {
        case 0: throw new TypeError('The "pid" argument must be specified');
        case 1: throw new TypeError('The "encoding" argument must be specified');
        case 2: case 3: case 4: case 5: break;
        default: throw new TypeError('Too many arguments were specified');
    }
    if (typeof pid !== "number") { throw new TypeError('The "pid" argument must be a number') }
    if (typeof encoding !== "string") { throw new TypeError(`The "encoding" argument must be a string, is a: ${typeof encoding}`) }
    const decoder = new TextDecoder(encoding, options);
    const array = addon.get_argv_of_pid(pid, nuls ?? false, skip ?? 0);
    return decoder.decode(array);
}

addon.as_array = function as_array(pid: number, encoding: TextEncoding, options: TextDecoderOptions): Array<string> {
    switch (arguments.length) {
        case 0: throw new TypeError('The "pid" argument must be specified');
        case 1: throw new TypeError('The "encoding" argument must be specified');
        case 2: case 3: break;
        default: throw new TypeError('Too many arguments were specified');
    }
    if (typeof pid !== "number") { throw new TypeError('The "pid" argument must be a number') }
    if (typeof encoding !== "string") { throw new TypeError(`The "encoding" argument must be a string, is a: ${typeof encoding}`) }
    const decoder = new TextDecoder(encoding, options);
    const array = addon.get_argv_and_argc_of_pid(pid);
    return array.map(b => decoder.decode(b));
}

exports.PID_MAX = addon.PID_MAX;
exports.ARG_MAX = addon.ARG_MAX;
exports.get_argv_of_pid = addon.get_argv_of_pid;
exports.as_string = addon.as_string;
exports.get_argv_and_argc_of_pid = addon.get_argv_and_argc_of_pid;
exports.as_array = addon.as_array;

export = addon;
