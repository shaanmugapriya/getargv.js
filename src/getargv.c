#include <errno.h>
#include <libgetargv.h>
#include <node_api.h>
#include <stdint.h>
#include <string.h>
#include <sys/sysctl.h>

// if cannot prevent non macos installs: use this error
// ERR_FEATURE_UNAVAILABLE_ON_PLATFORM
// process.platform != 'darwin'

napi_value GetArgvOfPid(napi_env env, napi_callback_info info) {
  size_t argc = 3;
  napi_value argv[argc];

  if (napi_get_cb_info(env, info, &argc, argv, NULL, NULL) != napi_ok) {
    napi_throw_error(env, "ERR_AMBIGUOUS_ARGUMENT",
                     "Failed to parse arguments");
  }
  if (argc < 1) {
    napi_throw_type_error(env, "ERR_MISSING_ARGS",
                          "The \"pid\" argument must be specified");
  } else if (argc > 3) {
    napi_throw_type_error(env, "ERR_TOO_MANY_ARGS",
                          "Too many arguments were provided, max: 3");
  }

  pid_t pid = 0;
  if (napi_get_value_int32(env, argv[0], &pid) != napi_ok) {
    napi_throw_type_error(env, "ERR_INVALID_ARG_TYPE",
                          "Invalid number was passed as first argument");
  }
  if (pid < 0 || pid > _PID_MAX) {
    // or ERR_OUT_OF_RANGE
    napi_throw_range_error(env, "ERR_INVALID_ARG_VALUE",
                           "Invalid PID was passed as first argument");
  }

  bool nuls = false;
  if (argc > 1) {
    if (napi_get_value_bool(env, argv[1], &nuls) != napi_ok) {
      napi_throw_type_error(env, "ERR_INVALID_ARG_TYPE",
                            "Invalid bool was passed as second argument");
    }
  }

  int64_t skip = 0;
  if (argc > 2) {
    if (napi_get_value_int64(env, argv[2], &skip) != napi_ok) {
      napi_throw_type_error(env, "ERR_INVALID_ARG_TYPE",
                            "Invalid number was passed as third argument");
    }
    if (skip < 0 || skip > ARG_MAX) {
      // or ERR_OUT_OF_RANGE
      napi_throw_range_error(env, "ERR_INVALID_ARG_VALUE",
                             "Invalid number was passed as third argument");
    }
  }

  struct GetArgvOptions options = {.pid = pid, .nuls = nuls, .skip = skip};
  struct ArgvResult result;

  if (!get_argv_of_pid(&options, &result)) {
    errno_t err = errno;

    napi_value code;
    if (napi_ok != napi_create_string_utf8(env, "ERR_SYSTEM_ERROR", NAPI_AUTO_LENGTH, &code)) {
      napi_throw_error(env, "ERR_INTERNAL_ASSERTION", "Failed to create String object");
    }

    napi_value msg;
    if (napi_ok != napi_create_string_utf8(env, strerror(err), NAPI_AUTO_LENGTH, &msg)) {
      napi_throw_error(env, "ERR_INTERNAL_ASSERTION", "Failed to create String object");
    }

    napi_value error;
    if (napi_ok != napi_create_error(env, code, msg, &error)) {
      napi_throw_error(env, "ERR_INTERNAL_ASSERTION", "Failed to create Error object");
    }

    napi_value value;
    if (napi_ok != napi_create_int32(env, err, &value)) {
      napi_throw_error(env, "ERR_INTERNAL_ASSERTION", "Failed to create number");
    }

    if (napi_ok != napi_set_named_property(env, error, "errno", value)) {
      napi_throw_error(env, "ERR_INTERNAL_ASSERTION", "Failed to set property on Error object");
    }

    napi_throw(env, error);
  }

  napi_value args;
  if (napi_create_string_utf8(env, result.start_pointer, result.end_pointer - result.start_pointer + 1, &args) != napi_ok) {
    napi_throw_error(env, NULL, "Unable to create return value");
  }

  return args;
}

napi_value Init(napi_env env, napi_value exports) {
  // Module initialization code goes here
  napi_status status;
  napi_value fn;

  // Arguments 2 and 3 are function name and length respectively
  // We will leave them as empty for this example
  status = napi_create_function(env, "get_argv_of_pid", NAPI_AUTO_LENGTH, GetArgvOfPid, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function");
  }

  status = napi_set_named_property(env, exports, "get_argv_of_pid", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports");
  }

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
