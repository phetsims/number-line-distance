// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Africa Modest region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import exploreHomeIcon_png from '../../../images/africa-modest/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/africa-modest/exploreNavbarIcon_png.js';
import person_png from '../../../images/africa-modest/person_png.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import { AFRICA_MODEST_QUERY_VALUE } from '../NLDQueryParameters.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfricaModest = new ExplorerCharacterSet(
    NumberLineDistanceStrings.characterSet.africaModestStringProperty,
    person_png,
    25,
    exploreHomeIcon_png,
    exploreNavbarIcon_png,
    AFRICA_MODEST_QUERY_VALUE
);

export default ExplorerCharacterSetAfricaModest;