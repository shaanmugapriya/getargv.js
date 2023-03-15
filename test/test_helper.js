const iassert = require("assert");

const errors = [];

function assert_true() {
    try {
        iassert(...arguments);
        process.stdout.write(".");
    } catch (e) {
        process.stdout.write("F");
        errors.push(e);
    }
}

const assert = assert_true;
Object.entries(iassert).forEach(([k, v]) => {
    if (typeof v === 'function') {
        assert[k] = function () {
            try {
                v(...arguments);
                process.stdout.write(".");
            } catch (e) {
                process.stdout.write("F");
                errors.push(e);
            }
        };
    }
});

exports.assert = assert;

exports.expected_args = function expected_args() {
    const enc = new TextEncoder();
    return [process.argv0, ...process.execArgv, ...process.argv.slice(1)].map(a => enc.encode(a.replace(process.cwd(), ".") + "\0").buffer);
};

exports.section = function section(msg) {
    process.stdout.write(`\n${msg}: `);
};

exports.footer = function footer() {
    if (errors.length == 0) {
        console.log("\n\nTests passed & everything looks OK!");
    } else {
        console.log("\n\nThere were errors in this run:\n\n");
        errors.forEach(e => console.error(e));
    }
};

exports.header = function header() {
    console.log("Starting tests");
};
