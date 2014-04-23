#! /bin/bash -eu

. config/env.sh
./node_modules/.bin/grunt parse-config
exec node --trace_gc --trace_gc_verbose --max_new_space_size=16384 --max_old_space_size=48 clamshellServer