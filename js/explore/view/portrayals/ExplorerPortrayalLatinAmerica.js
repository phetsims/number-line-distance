// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { LATIN_AMERICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreHomeIcon_png from '../../../../images/latin-america/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../../images/latin-america/exploreNavbarIcon_png.js';
import person_png from '../../../../images/latin-america/person_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalLatinAmerica = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.latinAmericaStringProperty,
  person_png,
  35,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  LATIN_AMERICA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalLatinAmerica;