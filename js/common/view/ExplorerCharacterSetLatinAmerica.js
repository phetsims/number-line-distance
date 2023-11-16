// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import RegionAndCultureHeadshotIcon from '../../../../joist/js/preferences/RegionAndCultureHeadshotIcon.js';
import exploreHomeIcon_png from '../../../images/latin-america/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/latin-america/exploreNavbarIcon_png.js';
import person_png from '../../../mipmaps/latin-america/person_png.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import NLDConstants from '../NLDConstants.js';
import { LATIN_AMERICA_QUERY_VALUE } from '../NLDQueryParameters.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetLatinAmerica = new ExplorerCharacterSet(
  NumberLineDistanceStrings.characterSet.latinAmericaStringProperty,
  new RegionAndCultureHeadshotIcon( person_png, NLDConstants.HEADSHOT_OPTIONS ),
  person_png,
  35,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  LATIN_AMERICA_QUERY_VALUE
);

export default ExplorerCharacterSetLatinAmerica;