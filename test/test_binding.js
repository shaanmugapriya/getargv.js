const Getargv = require("../dist/binding.js");
const assert = require("assert");
const process = require("process");

function expected_args() {
    const enc = new TextEncoder();
    return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a => enc.encode(a.replace(process.cwd(), ".") + "\0").buffer);
}

assert(Getargv, "The export is undefined");
assert('PID_MAX' in Getargv);
assert.equal(Getargv.PID_MAX, 99999);
assert('ARG_MAX' in Getargv);
assert.equal(Getargv.ARG_MAX, 1024 * 1024);

function test_Get_Argv_Of_Pid() {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const result = Getargv.get_argv_of_pid(process.pid);
    const expected_string = expected_args().map(e => dec.decode(e)).join("");
    assert.strictEqual(dec.decode(result), expected_string, "Unexpected string value returned");
    assert.deepStrictEqual(result, enc.encode(expected_string).buffer, "Unexpected ArrayBuffer value returned");//deep b/c it's an arraybuffer
}

function test_Get_Argv_And_Argc_Of_Pid() {
    const result = Getargv.get_argv_and_argc_of_pid(process.pid);
    const expected = expected_args();
    assert.deepStrictEqual(result, expected_args(), "Unexpected value returned");
}

function test_as_string_encoding_does_something() {
    const dec = new TextDecoder();
    const result = Getargv.as_string(process.pid, "utf-16");
    const expected = expected_args().map(e => dec.decode(e)).join("");
    assert.notEqual(result, expected, "Unexpected value returned");
}

function test_as_array_encoding_does_something() {
    const dec = new TextDecoder();
    const result = Getargv.as_array(process.pid, "utf-16");
    const expected = expected_args().map(e => dec.decode(e));
    assert.notDeepEqual(result, expected, "Unexpected value returned");
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

assert.doesNotThrow(test_as_string_encoding_does_something, undefined, "test_Get_Argv_Of_Pid threw an expection");
assert.doesNotThrow(test_as_array_encoding_does_something, undefined, "test_Get_Argv_And_Argc_Of_Pid threw an expection");

console.log("Tests passed & everything looks OK!");
