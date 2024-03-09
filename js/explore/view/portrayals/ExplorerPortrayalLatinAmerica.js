// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { LATIN_AMERICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import latinAmericaExploreHomeIcon_png from '../../../../images/localized/latinAmericaExploreHomeIcon_png.js';
import latinAmericaExploreNavbarIcon_png from '../../../../images/localized/latinAmericaExploreNavbarIcon_png.js';
import latinAmericaPerson_png from '../../../../images/localized/latinAmericaPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalLatinAmerica = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.latinAmericaStringProperty,
  latinAmericaPerson_png,
  35,
  latinAmericaExploreHomeIcon_png,
  latinAmericaExploreNavbarIcon_png,
  LATIN_AMERICA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalLatinAmerica;