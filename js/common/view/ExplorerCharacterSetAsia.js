// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Asia region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import RegionAndCultureHeadshotIcon from '../../../../joist/js/preferences/RegionAndCultureHeadshotIcon.js';
import exploreHomeIcon_png from '../../../images/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/exploreNavbarIcon_png.js';
import person_png from '../../../mipmaps/asia/person_png.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import NLDConstants from '../NLDConstants.js';
import { ASIA_QUERY_VALUE } from '../NLDQueryParameters.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAsia = new ExplorerCharacterSet(
  NumberLineDistanceStrings.characterSet.asiaStringProperty,
  new RegionAndCultureHeadshotIcon( person_png, NLDConstants.HEADSHOT_OPTIONS ),
  person_png,
  30,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  ASIA_QUERY_VALUE
);

export default ExplorerCharacterSetAsia;