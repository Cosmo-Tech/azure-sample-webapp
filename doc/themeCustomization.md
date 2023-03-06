# Theme customization

## Create a new color theme

- First, duplicate the directories `src/theme/custom/cosmoDark`
 (resp. `src/theme/custom/cosmoLight`) and rename it fooDark (resp. fooLight) for instance.

- Then, in the newly created directory, create `src/theme/custom/fooDark/palette.js`
 (resp. `src/theme/custom/fooLight/palette.js`)
 and set the colors dictionary as follows (colors are given as an example):

```javascript
export default {
  mode: 'dark',
  primary: {
    main: '#a4bfe4',
    contrastText: '#000000',
  },
  secondary: {
    main: '#ffe26b',
    contrastText: '#000000',
  },
  error: {
    main: '#e57373',
    contrastText: '#000000',
  },
  warning: {
    main: '#ffa726',
    contrastText: '#000000',
  },
  info: {
    main: '#67B8E3',
    contrastText: '#000000',
  },
  success: {
    main: '#66bb6a',
    contrastText: '#000000',
  },
  microsoft: {
    main: '#2F2F2F',
    contrastText: '#FFFFFF',
  },
  appbar: {
    main: '#121212',
    contrastText: '#FFFFFF',
  },
  login: {
    main: '#2F363B',
  },
};
```

Do the same for your light theme.

NB: There are other colors that can be modified, and the listed colors above are not mandatory. MUI has its own colors,
 and functions to compute missing ones, this is only to override the existing ones. For a complete theme file, see
 [default theme from MUI](https://mui.com/material-ui/customization/default-theme/), especially the `palette` entry.

## Customize the webapp logo and the *sign in* wallpaper

- Put your logo (fooDark.png resp. fooLight.png for instance) and your *sign in* picture (authDark.png resp. authDark.png)
  in the directory: `public/theme`

- Then, create `src/theme/custom/cosmoDark/picture.js` (resp. `src/theme/custom/cosmoDark/picture.js`) and set your picture paths in it:

```javascript
export default {
  logo: 'theme/fooDark.png',
  auth: 'theme/authDark.png',
};
```

- Do the same for your light theme.

## Customize the AG grid Theme
- From the [AG grid documentation](https://www.ag-grid.com/javascript-data-grid/themes/),
 chose your favorite theme and specify it in `src/theme/custom/cosmoDark/picture.js`:

```javascript
export default {
  agTheme: 'ag-theme-balham-dark',
};
```

## Declare your overrides

- Open `src/theme/custom/index.js` and set the required theme directories:

```javascript
export { palette as paletteLight, picture as pictureLight, grid as gridLight } from './fooLight';
export { palette as paletteDark, picture as pictureDark, grid as gridDark } from './fooDark';
```
