// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Africa Modest region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../joist/js/JoistStrings.js';
import { AFRICA_MODEST_REGION_AND_CULTURE_ID } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreHomeIcon_png from '../../../images/africa-modest/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/africa-modest/exploreNavbarIcon_png.js';
import person_png from '../../../images/africa-modest/person_png.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfricaModest = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaModestStringProperty,
  person_png,
  25,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  AFRICA_MODEST_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetAfricaModest;