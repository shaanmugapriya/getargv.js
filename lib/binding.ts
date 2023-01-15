interface GetArgv {

    readonly PID_MAX: number;

    readonly ARG_MAX: number;

    get_argv_of_pid(pid: number, nuls: boolean, skip: number): string

    get_argv_and_argc_of_pid(pid: number): Array<string>

}

const addon: GetArgv = require('../build/Release/getargv_native');

exports.PID_MAX = addon.PID_MAX;
exports.ARG_MAX = addon.ARG_MAX;
exports.get_argv_of_pid = addon.get_argv_of_pid;
exports.get_argv_and_argc_of_pid = addon.get_argv_and_argc_of_pid;
