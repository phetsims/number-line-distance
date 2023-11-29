// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.ts';
import { LATIN_AMERICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.ts';
import exploreHomeIcon_png from '../../../../images/latin-america/exploreHomeIcon_png.ts';
import exploreNavbarIcon_png from '../../../../images/latin-america/exploreNavbarIcon_png.ts';
import person_png from '../../../../images/latin-america/person_png.ts';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetLatinAmerica = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.latinAmericaStringProperty,
  person_png,
  35,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  LATIN_AMERICA_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetLatinAmerica;