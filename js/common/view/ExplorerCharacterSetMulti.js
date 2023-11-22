// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import JoistStrings from '../../../../joist/js/JoistStrings.js';
import { MULTICULTURAL_REGION_AND_CULTURE_ID } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';
import ExplorerCharacterSetAfrica from './ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from './ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from './ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from './ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetUSA from './ExplorerCharacterSetUSA.js';

const RANDOM_CHARACTER_SET = dotRandom.sample( [
  ExplorerCharacterSetAfrica,
  ExplorerCharacterSetAfricaModest,
  ExplorerCharacterSetAsia,
  ExplorerCharacterSetLatinAmerica,
  ExplorerCharacterSetUSA
] );

const ExplorerCharacterSetMulti = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.multiculturalStringProperty,
  RANDOM_CHARACTER_SET.standing,
  RANDOM_CHARACTER_SET.offset,
  RANDOM_CHARACTER_SET.screenHomeIcon,
  RANDOM_CHARACTER_SET.screenNavIcon,
  MULTICULTURAL_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetMulti;