<h1><img src="logo.svg" width="200" alt="getargv"></h1>

[![Node.js](https://github.com/getargv/getargv.js/actions/workflows/node.yml/badge.svg)](https://github.com/getargv/getargv.js/actions/workflows/node.yml)
[![npm version](https://badge.fury.io/js/@camjn%2Fgetargv.svg)](https://badge.fury.io/js/@camjn%2Fgetargv)

This module allows you to query the arguments of other processes on macOS.

## Module Installation

 - Install `libgetargv` to your system (see below).
 - Install the module and add to the application's package.json by executing:

    $ npm install --save-optional @camjn/getargv

Saving this module as optional is important because it can only build on macOS, so npm needs to be able to exclude it on other OSs.

## Library Installation

 - To get access to `libgetargv`, sign up for an appropriate [sponsorship tier](https://github.com/sponsors/CamJN).
 - Clone the `libgetargv` repo: `git clone https://github.com/getargv/getargv.git`.
 - Running `make install_dylib`, installs the library to the `/usr/local/` prefix by default; you can change the install location with the `PREFIX` `make` variable: `make PREFIX=/opt install_dylib`.

## Building `libgetargv`

I've built `libgetargv` on macOS 10.7-13, using only the <abbr title="Command Line Tools">CLT</abbr> package, not the full Xcode install. If you need to override variables, do so inside the `make` command, eg: `make EXTRA_CPPFLAGS=-DMACRO EXTRA_CFLAGS=-std=c17 dylib`.

## Usage

```js
import { get_argv_of_pid as get_argv_of_pid_as_string, get_argv_and_argc_of_pid as get_argv_of_pid_as_array } from "@camjn/getargv";
get_argv_of_pid_as_string(some_process_id) //=> "arg0\x00arg1"
get_argv_of_pid_as_array(some_process_id) //=> ["arg0","arg1"]
```

## Development

After checking out the repo, run `npm i` to install dependencies. Then, run `npm run test` to run the tests. You can also run `npm run console` for an interactive prompt that will allow you to experiment.

TS code goes in the `lib` dir, C code goes in the `src` dir.

To install this module onto your local machine, run `npm install`. To release a new version, run `npm version patch` to update the version number in `package.json` and create a git tag for the version, and push git commits and the created tag to the git origin; and then run `npm publish`, which will push the module to [npm](https://www.npmjs.com).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/getargv/getargv.js.

## License

The module is available as open source under the terms of the [BSD 3-clause License](https://opensource.org/licenses/BSD-3-Clause).
