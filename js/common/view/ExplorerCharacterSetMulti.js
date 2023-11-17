// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import { MULTICULTURAL_QUERY_VALUE } from '../NLDQueryParameters.js';
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
    NumberLineDistanceStrings.characterSet.multiculturalStringProperty,
    RANDOM_CHARACTER_SET.standing,
    RANDOM_CHARACTER_SET.offset,
    RANDOM_CHARACTER_SET.screenHomeIcon,
    RANDOM_CHARACTER_SET.screenNavIcon,
    MULTICULTURAL_QUERY_VALUE
);

export default ExplorerCharacterSetMulti;