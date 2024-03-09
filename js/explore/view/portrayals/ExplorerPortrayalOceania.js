// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { OCEANIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import oceaniaExploreHomeIcon_png from '../../../../images/localized/oceaniaExploreHomeIcon_png.js';
import oceaniaExploreNavbarIcon_png from '../../../../images/localized/oceaniaExploreNavbarIcon_png.js';
import oceaniaPerson_png from '../../../../images/localized/oceaniaPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalOceania = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.oceaniaStringProperty,
  oceaniaPerson_png,
  30,
  oceaniaExploreHomeIcon_png,
  oceaniaExploreNavbarIcon_png,
  OCEANIA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalOceania;