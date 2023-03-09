const Getargv = require("../dist/binding");
const { assert, header, section, footer, expected_args } = require("./test_helper");
const process = require("process");

header();

section("Testing constants");//--------------------------------------------------

assert(Getargv, "The export is undefined");
assert('PID_MAX' in Getargv);
assert.equal(Getargv.PID_MAX, 99999);
assert('ARG_MAX' in Getargv);
assert.equal(Getargv.ARG_MAX, 1024 * 1024);

section("Testing errors");//-----------------------------------------------------

assert.throws(Getargv.as_string, {
    name: 'TypeError',
    message: 'The "pid" argument must be specified',
});

assert.throws(_ => Getargv.as_string(process.pid), {
    name: 'TypeError',
    message: 'The "encoding" argument must be specified',
});

assert.throws(_ => Getargv.as_string('a', 'utf-8'), {
    name: 'TypeError',
    message: 'Invalid number was passed as first argument',
});

assert.throws(_ => Getargv.as_string(process.pid, 'a'), {
    name: 'RangeError',
    message: 'The "a" encoding is not supported',
});

assert.throws(Getargv.as_array, {
    name: 'TypeError',
    message: 'The "pid" argument must be specified',
});

assert.throws(_ => Getargv.as_array(process.pid), {
    name: 'TypeError',
    message: 'The "encoding" argument must be specified',
});

assert.throws(_ => Getargv.as_array('a', 'utf-8'), {
    name: 'TypeError',
    message: 'Invalid number was passed as first argument',
});

assert.throws(_ => Getargv.as_array(process.pid, 'a'), {
    name: 'RangeError',
    message: 'The "a" encoding is not supported',
});

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

section("Testing functions");//--------------------------------------------------

assert.doesNotThrow(_ => {
    const result = Getargv.get_argv_and_argc_of_pid(process.pid);
    const expected = expected_args();
    assert.deepStrictEqual(result, expected, "Unexpected value returned");
}, undefined, "test_Get_Argv_And_Argc_Of_Pid threw an expection");

assert.doesNotThrow(_ => {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const result = Getargv.get_argv_of_pid(process.pid);
    const expected_string = expected_args().map(e => dec.decode(e)).join("");
    assert.strictEqual(dec.decode(result), expected_string, "Unexpected string value returned");
    assert.deepStrictEqual(result, enc.encode(expected_string).buffer, "Unexpected ArrayBuffer value returned");//deep b/c it's an arraybuffer
}, undefined, "test_Get_Argv_Of_Pid threw an expection");

assert.doesNotThrow(_ => {
    const dec = new TextDecoder();
    const result = Getargv.as_string(process.pid, "utf-8");
    const expected = expected_args().map(e => dec.decode(e)).join("");
    assert.equal(result, expected, "Unexpected value returned");
}, undefined, "test_as_string threw an expection");

assert.doesNotThrow(_ => {
    const dec = new TextDecoder();
    const result = Getargv.as_array(process.pid, "utf-8");
    const expected = expected_args().map(e => dec.decode(e));
    assert.deepEqual(result, expected, "Unexpected value returned");
}, undefined, "test_as_array threw an expection");

assert.doesNotThrow(_ => {
    const dec = new TextDecoder();
    const result = Getargv.as_string(process.pid, "utf-16");
    const expected = expected_args().map(e => dec.decode(e)).join("");
    assert.notEqual(result, expected, "Unexpected value returned");
}, undefined, "test_as_string_encoding_does_something threw an expection");

assert.doesNotThrow(_ => {
    const dec = new TextDecoder();
    const result = Getargv.as_array(process.pid, "utf-16");
    const expected = expected_args().map(e => dec.decode(e));
    assert.notDeepEqual(result, expected, "Unexpected value returned");
}, undefined, "test_as_array_encoding_does_something threw an expection");

footer();
