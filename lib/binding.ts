interface CBinding {

    get_argv_of_pid(pid: number, nuls: boolean, skip: number): string

    get_argv_and_argc_of_pid(pid: number): Array<string>

}

const addon: CBinding = require('../build/Release/getargv_native');

export = addon
