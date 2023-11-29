// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { OCEANIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreHomeIcon_png from '../../../../images/oceania/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../../images/oceania/exploreNavbarIcon_png.js';
import person_png from '../../../../images/oceania/person_png.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetOceania = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.oceaniaStringProperty,
  person_png,
  30,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  OCEANIA_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetOceania;