// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.ts';
import { USA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.ts';
import exploreHomeIcon_png from '../../../../images/usa/exploreHomeIcon_png.ts';
import exploreNavbarIcon_png from '../../../../images/usa/exploreNavbarIcon_png.ts';
import person_png from '../../../../images/usa/person_png.ts';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.unitedStatesOfAmericaStringProperty,
  person_png,
  18,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  USA_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetUSA;