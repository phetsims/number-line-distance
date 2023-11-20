// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import exploreHomeIcon_png from '../../../images/usa/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/usa/exploreNavbarIcon_png.js';
import person_png from '../../../images/usa/person_png.js';
import personHighRes_png from '../../../images/usa/personHighRes_png.js';
import personLargeArtboard_png from '../../../images/usa/personLargeArtboard_png.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import NLDQueryParameters, { USA_QUERY_VALUE } from '../NLDQueryParameters.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';

// TODO: this is an experiment to eliminate fuzziness, see: https://github.com/phetsims/number-line-distance/issues/72
const person = NLDQueryParameters.personImage === 'person' ? person_png : NLDQueryParameters.personImage === 'personHighRes' ? personHighRes_png : personLargeArtboard_png;
const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
    NumberLineDistanceStrings.characterSet.unitedStatesOfAmericaStringProperty,
    person,
    18,
    exploreHomeIcon_png,
    exploreNavbarIcon_png,
    USA_QUERY_VALUE
);

export default ExplorerCharacterSetUSA;