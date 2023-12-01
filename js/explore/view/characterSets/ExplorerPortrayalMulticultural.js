// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { MULTICULTURAL_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';
import ExplorerPortrayalAfrica from './ExplorerPortrayalAfrica.js';
import ExplorerPortrayalAfricaModest from './ExplorerPortrayalAfricaModest.js';
import ExplorerPortrayalAsia from './ExplorerPortrayalAsia.js';
import ExplorerPortrayalLatinAmerica from './ExplorerPortrayalLatinAmerica.js';
import ExplorerPortrayalUSA from './ExplorerPortrayalUSA.js';

const RANDOM_CHARACTER_SET = dotRandom.sample( [
  ExplorerPortrayalAfrica,
  ExplorerPortrayalAfricaModest,
  ExplorerPortrayalAsia,
  ExplorerPortrayalLatinAmerica,
  ExplorerPortrayalUSA
] );

const ExplorerPortrayalMulticultural = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.multiculturalStringProperty,
  RANDOM_CHARACTER_SET.standing,
  RANDOM_CHARACTER_SET.offset,
  RANDOM_CHARACTER_SET.screenHomeIcon,
  RANDOM_CHARACTER_SET.screenNavIcon,
  MULTICULTURAL_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalMulticultural;