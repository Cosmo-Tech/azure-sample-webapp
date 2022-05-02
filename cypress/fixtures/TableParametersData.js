// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const EXPECTED_CUSTOMERS_BASIC_EDITION =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bob,11,false,AppleJuice,01/04/2011,1.40\n' +
  'Lily,8,true,AppleJuice,09/05/2013,1.41\n' +
  'Maria,34,true,Beer,19/03/1987,1.90\n' +
  'Howard,34,true,Beer,01/01/1991,2.01';

// On XLSX import, trailing zeroes are removed in number values
export const EXPECTED_CUSTOMERS_AFTER_XLSX_IMPORT =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bob,11,false,AppleJuice,01/04/2011,1.4\n' +
  'Lily,8,true,AppleJuice,09/05/2013,1.41\n' +
  'Maria,34,true,Beer,19/03/1987,1.9\n' +
  'Howard,34,true,Beer,01/01/1991,2.01';

export const EXPECTED_CUSTOMERS_AFTER_IMPORT_WITH_EMPTY_FIELDS =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bob,22,true,Beer,01/01/2000,\n' +
  'Sing,26,false,Beer,02/02/1994,1.9\n' +
  'Clara,,false,Beer,,\n' +
  'Henda,,true,Beer,,2\n' +
  'Pete,,true,AppleJuice,09/09/1965,\n' +
  'Mostefa,,true,Beer,15/08/1994,\n' +
  'Anna,23,false,Beer,,1.8\n' +
  'Ewan,,false,Wine,,';
