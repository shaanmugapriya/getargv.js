const { get_argv_of_pid } = require('./binding');

const pid = Number.parseInt(process.argv.pop()!);
if (!Number.isInteger(pid)) throw "pid is not a number";

const nuls_index = process.argv.indexOf("-0");
const keep_nuls = nuls_index != -1;
if (keep_nuls) process.argv.splice(nuls_index, 1);

const skip_index = process.argv.indexOf("-s");
let skip = 0;
if (skip_index > -1) {
    skip = Number.parseInt(process.argv[skip_index + 1]);
    if (!Number.isInteger(skip)) throw "skip is not a number";
}

const args = get_argv_of_pid(pid, !keep_nuls, skip);

process.stdout.write(args);
