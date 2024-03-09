// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { AFRICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import africaExploreHomeIcon_png from '../../../../images/localized/africaExploreHomeIcon_png.js';
import africaExploreNavbarIcon_png from '../../../../images/localized/africaExploreNavbarIcon_png.js';
import africaPerson_png from '../../../../images/localized/africaPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAfrica = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaStringProperty,
  africaPerson_png,
  30,
  africaExploreHomeIcon_png,
  africaExploreNavbarIcon_png,
  AFRICA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAfrica;