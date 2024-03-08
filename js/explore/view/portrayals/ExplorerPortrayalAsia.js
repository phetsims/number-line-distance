// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Asia region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { ASIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import asiaExploreHomeIcon_png from '../../../../images/localized/asiaExploreHomeIcon_png.js';
import asiaExploreNavbarIcon_png from '../../../../images/localized/asiaExploreNavbarIcon_png.js';
import asiaPerson_png from '../../../../images/localized/asiaPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAsia = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.asiaStringProperty,
  asiaPerson_png,
  30,
  asiaExploreHomeIcon_png,
  asiaExploreNavbarIcon_png,
  ASIA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAsia;