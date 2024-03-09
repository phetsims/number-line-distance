// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { USA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import usaExploreHomeIcon_png from '../../../../images/usa/usaExploreHomeIcon_png.js';
import usaExploreNavbarIcon_png from '../../../../images/usa/usaExploreNavbarIcon_png.js';
import usaPerson_png from '../../../../images/usa/usaPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalUSA = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.unitedStatesOfAmericaStringProperty,
  usaPerson_png,
  18,
  usaExploreHomeIcon_png,
  usaExploreNavbarIcon_png,
  USA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalUSA;