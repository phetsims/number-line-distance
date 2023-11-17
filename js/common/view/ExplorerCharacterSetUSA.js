// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import exploreHomeIcon_png from '../../../images/usa/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/usa/exploreNavbarIcon_png.js';
import person_png from '../../../mipmaps/usa/person_png.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import { USA_QUERY_VALUE } from '../NLDQueryParameters.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
    NumberLineDistanceStrings.characterSet.unitedStatesOfAmericaStringProperty,
    person_png,
    18,
    exploreHomeIcon_png,
    exploreNavbarIcon_png,
    USA_QUERY_VALUE
);

export default ExplorerCharacterSetUSA;