// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const EXPECTED_CUSTOMERS_BASIC_EDITION =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bill,11,false,AppleJuice,01/04/2011,1.40\n' +
  'Lily,8,true,AppleJuice,09/05/2013,1.41\n' +
  'Maria,34,true,Beer,19/03/1987,1.90\n' +
  'Howard,34,true,Beer,01/01/1991,2.01';

export const EXPECTED_CUSTOMERS_BASIC_EDITION_DATA = EXPECTED_CUSTOMERS_BASIC_EDITION.split('\n').map((row) =>
  row.split(',')
);

// On XLSX import, trailing zeroes are removed in number values
export const EXPECTED_CUSTOMERS_AFTER_XLSX_IMPORT =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bill,11,false,AppleJuice,01/04/2011,1.4\n' +
  'Lily,8,true,AppleJuice,09/05/2013,1.41\n' +
  'Maria,34,true,Beer,19/03/1987,1.9\n' +
  'Howard,34,true,Beer,01/01/1991,2.01\n' +
  'Billy,23,true,Beer,28/04/1940,1.25';

export const EXPECTED_CUSTOMERS_AFTER_IMPORT_WITH_EMPTY_FIELDS =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bob,22,true,Beer,01/01/2000,\n' +
  'Sing,26,false,Beer,02/02/1994,1.9\n' +
  'Clara,,false,Beer,,\n' +
  'Henda,,true,Beer,,2\n' +
  'Pete,,true,AppleJuice,09/09/1965,\n' +
  'Mostefa,,true,Beer,15/08/1994,\n' +
  'Anna,23,false,Beer,,1.8\n' +
  'Ewan,,false,Wine,,1.9';

export const EXPECTED_EVENTS_AFTER_XLSX_IMPORT =
  'theme,date,timeOfDay,eventType,reservationsNumber,online\n' +
  'complex systems,06/06/2022,evening,seminar,200,false\n' +
  'IoT,02/10/2024,midday,conference,250,false\n' +
  'supply chain,22/07/2020,evening,workshop,180,true\n' +
  'asset Management,13/08/2022,morning,conference,220,false\n' +
  'industry processes,18/09/2022,evening,workshop,150,false';

export const EXPECTED_CUSTOMERS_INHERITED_TABLE =
  'name,age,canDrinkAlcohol,favoriteDrink,birthday,height\n' +
  'Bob,78,false,AppleJuice,01/04/2011,2.01\n' +
  'Lily,8,true,AppleJuice,09/05/2013,1.41\n' +
  'Maria,34,true,Wine,19/03/1987,1.90\n' +
  'Howard,34,true,Beer,12/05/1987,1.83';
