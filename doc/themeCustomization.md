# Theme customization
## Create a new color theme
* First, duplicate directory [/src/theme/custom/default](../src/theme/custom/default) and rename it as your wish,
exemple('fooDark', 'fooLight', etc.).

* Then, in the newly created dircetory open the matching file [/src/theme/custom/fooDark/palette.js](../src/theme/custom/fooDark/palette.js) and
set the colors dictionnary:

```javascript
const themeColors = {
  primary: '#FFAD38',
  primaryVariant: '#A16612',
  secondary: '#466180',
  background: '#191919',
  backgroundVariant: '#1F1F1F',
  surface: '#2E2E2E',
  error: '#FF667F',
  warning: '#FB8C00',
  success: '#19E152',
  info: '#1E88E5',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#999A9D',
  backgroundSignInPage: '#2f363b',
  backgroundSignInButton: '#2F2F2F'
};
```

* Then you can recompose the correspondance between color and display elements:
```javascript
export default {
  type: 'light',
  white: themeColors.white,
  black: themeColors.black,
  primary: {
    contrastText: themeColors.black,
    main: themeColors.primary,
    dark: themeColors.primaryVariant
  },
  secondary: {
    contrastText: themeColors.black,
    main: themeColors.secondary
  },
```
* Don't forget to specify the type of your theme 'light' or 'dark':
```javascript
export default {
  type: 'light',
```

## Select the current theme for the webapp 
* Open the file [src/theme/custom/index.js](../src/theme/custom/index.js) and set the required theme directory:
```javascript
export { palette, typography, image } from './fooDark';
```

## Customize webapp logo and sign in wallpaper
* Put required logo and wallpaper picture in directory:
[public/theme](../public/theme)

* Then, open the file [src/theme/custom/fooDark/picture.js](../src/theme/custom/cosmoDark/picture.js)
and set picture url:
```javascript
export default {
  logo: 'theme/fooDark.png',
  auth: 'theme/authDark.png'
};
```
