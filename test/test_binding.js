const Getargv = require("../dist/binding.js");
const assert = require("assert");
const process = require("process");

function expected_args() {
    return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a => a.replace(process.cwd(), "."));
}

assert(Getargv, "The export is undefined");
assert('PID_MAX' in Getargv);
assert.equal(Getargv.PID_MAX, 99999);
assert('ARG_MAX' in Getargv);
assert.equal(Getargv.ARG_MAX, 1024 * 1024);

function test_Get_Argv_Of_Pid() {
    const result = Getargv.get_argv_of_pid(process.pid);
    assert.strictEqual(result, expected_args().join("\0") + "\0", "Unexpected value returned");
}

function test_Get_Argv_And_Argc_Of_Pid() {
    const result = Getargv.get_argv_and_argc_of_pid(process.pid);
    assert.deepStrictEqual(result, expected_args(), "Unexpected value returned");
}

assert.throws(Getargv.get_argv_of_pid, {
    name: 'TypeError',
    message: 'The "pid" argument must be specified',
});

assert.throws(_ => Getargv.get_argv_of_pid('a'), {
    name: 'TypeError',
    message: 'Invalid number was passed as first argument',
});

assert.throws(_ => Getargv.get_argv_of_pid(-1), {
    name: 'RangeError',
    message: 'Invalid PID was passed as first argument',
});

assert.throws(_ => Getargv.get_argv_of_pid(process.pid, 'a'), {
    name: 'TypeError',
    message: 'Invalid bool was passed as second argument',
});

assert.throws(_ => Getargv.get_argv_of_pid(process.pid, false, 'a'), {
    name: 'TypeError',
    message: 'Invalid number was passed as third argument',
});

assert.throws(_ => Getargv.get_argv_of_pid(process.pid, false, -1), {
    name: 'RangeError',
    message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
});

assert.throws(_ => Getargv.get_argv_of_pid(process.pid, false, (1024 * 1024) + 1), {
    name: 'RangeError',
    message: 'Invalid number was passed as third argument, must be between 0 and (1024 * 1024)',
});

assert.throws(Getargv.get_argv_and_argc_of_pid, {
    name: 'TypeError',
    message: 'The "pid" argument must be specified',
});

assert.throws(_ => Getargv.get_argv_and_argc_of_pid(process.pid, 'a'), {
    name: 'TypeError',
    message: 'Too many arguments were provided, max: 1',
});

assert.throws(_ => Getargv.get_argv_and_argc_of_pid(-1), {
    name: 'RangeError',
    message: 'Invalid PID was passed as first argument',
});

assert.throws(_ => Getargv.get_argv_and_argc_of_pid(-1), {
    name: 'RangeError',
    message: 'Invalid PID was passed as first argument',
});

assert.doesNotThrow(test_Get_Argv_Of_Pid, undefined, "test_Get_Argv_Of_Pid threw an expection");
assert.doesNotThrow(test_Get_Argv_And_Argc_Of_Pid, undefined, "test_Get_Argv_And_Argc_Of_Pid threw an expection");

console.log("Tests passed & everything looks OK!");
