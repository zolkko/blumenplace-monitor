# blumenplace-monitor

## Run Project

```sh
npm install
npm start
npm run webpack
```

After you see the webpack compilation succeed (the `npm run webpack` step), open up `src/index.html` (**no server needed!**). Then modify whichever `.re` file in `src` and refresh the page to see the changes.

**For more elaborate ReasonReact examples**, please see https://github.com/reasonml-community/reason-react-example

## Build for Production

```sh
npm run build
npm run webpack:production
```

This will replace the development artifact `build/Index.js` for an optimized version.

**To enable dead code elimination**, change `bsconfig.json`'s `package-specs` `module` from `"commonjs"` to `"es6"`. Then re-run the above 2 commands. This will allow Webpack to remove unused code.

## Docker container
To build the docker container run
```sh
$ docker build --force-rm -f docker/Dockerfile -t blumenplace-monitor .
```

```sh
$ docker run -it -p 8080:8080 --rm blumenplace-monitor
```
