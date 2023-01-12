const Getargv = require("../dist/binding.js");
const assert = require("assert");
const process = require("process");

function expected_args() {
    return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a => a.replace(process.cwd(), "."));
}

assert(Getargv, "The export is undefined");

function test_Get_Argv_Of_Pid() {
    const result = Getargv.get_argv_of_pid(process.pid);
    assert.strictEqual(result, expected_args().join("\0") + "\0", "Unexpected value returned");
}

function test_Get_Argv_And_Argc_Of_Pid() {
    const result = Getargv.get_argv_and_argc_of_pid(process.pid);
    assert.deepStrictEqual(result, expected_args(), "Unexpected value returned");
}

assert.doesNotThrow(test_Get_Argv_Of_Pid, undefined, "test_Get_Argv_Of_Pid threw an expection");
assert.doesNotThrow(test_Get_Argv_And_Argc_Of_Pid, undefined, "test_Get_Argv_And_Argc_Of_Pid threw an expection");

console.log("Tests passed & everything looks OK!");
