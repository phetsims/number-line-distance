// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import dotRandom from '../../../../../dot/js/dotRandom.js';
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

const ExplorerPortrayalRandom = new ExplorerPortrayal(
  'random',
  RANDOM_CHARACTER_SET.standing,
  RANDOM_CHARACTER_SET.offset,
  RANDOM_CHARACTER_SET.screenHomeIcon,
  RANDOM_CHARACTER_SET.screenNavIcon
);

export default ExplorerPortrayalRandom;