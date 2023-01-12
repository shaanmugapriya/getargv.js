{
    "targets": [{
        "target_name": "getargv_native",
        "sources": [ "src/getargv.c" ],
        "defines": [ "_PID_MAX=<!@(man setaudit_addr | egrep -oe 'PID_MAX.*[0-9]+' | awk -F'[^0-9]' '{print $NF}')" ],
        "include_dirs": [
            "<!@(pkg-config getargv --cflags-only-I | sed s/-I//g)",
        ],
        "link_settings": {
            "libraries": [
                "<!@(pkg-config getargv --libs)",
            ]
        },
        "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET": "10.7"
        }
    }]
}
