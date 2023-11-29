// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Asia region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { ASIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreHomeIcon_png from '../../../../images/asia/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../../images/asia/exploreNavbarIcon_png.js';
import person_png from '../../../../images/asia/person_png.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAsia = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.asiaStringProperty,
  person_png,
  30,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  ASIA_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetAsia;