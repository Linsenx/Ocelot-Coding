ROOT=$PWD/node_modules/monaco-editor/esm/vs
OPTS="--no-source-maps --log-level 1"        # Parcel options - See: https://parceljs.org/cli.html

./node_modules/.bin/parcel build $ROOT/language/json/json.worker.js $OPTS
./node_modules/.bin/parcel build $ROOT/language/css/css.worker.js $OPTS
./node_modules/.bin/parcel build $ROOT/language/html/html.worker.js $OPTS
./node_modules/.bin/parcel build $ROOT/language/typescript/ts.worker.js $OPTS
./node_modules/.bin/parcel build $ROOT/editor/editor.worker.js $OPTS