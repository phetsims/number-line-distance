// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Africa Modest region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { AFRICA_MODEST_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import africaModestExploreHomeIcon_png from '../../../../images/africaModest/africaModestExploreHomeIcon_png.js';
import africaModestExploreNavbarIcon_png from '../../../../images/africaModest/africaModestExploreNavbarIcon_png.js';
import africaModestPerson_png from '../../../../images/africaModest/africaModestPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAfricaModest = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaModestStringProperty,
  africaModestPerson_png,
  25,
  africaModestExploreHomeIcon_png,
  africaModestExploreNavbarIcon_png,
  AFRICA_MODEST_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAfricaModest;