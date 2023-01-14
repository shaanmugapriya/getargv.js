const { get_argv_of_pid } = require('./binding');

function exit(msg: string) {
    console.error(msg);
    process.exitCode = -1;
}

// [node, script] are first two args
if (process.argv.length < 3) {
    exit("a pid argument is required");
} else {
    const pid = Number.parseInt(process.argv.pop()!);
    if (!Number.isInteger(pid)) {
        exit("pid is not a number");
    } else {
        const nuls_index = process.argv.indexOf("-0");
        const keep_nuls = nuls_index != -1;
        if (keep_nuls) process.argv.splice(nuls_index, 1);

        const skip_index = process.argv.indexOf("-s");
        let skip = 0;
        if (skip_index > -1) {
            skip = Number.parseInt(process.argv[skip_index + 1]);
            if (!Number.isInteger(skip)) exit("argument to skip flag (-s) is not a number");
        }

        if (process.exitCode == undefined) {
            const args = get_argv_of_pid(pid, !keep_nuls, skip);
            process.stdout.write(args);
        }
    }
}
