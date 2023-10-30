// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import exploreHomeIcon_png from '../../../images/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/exploreNavbarIcon_png.js';
import person_png from '../../../mipmaps/person_png.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';
import { Image } from '../../../../scenery/js/imports.js';


const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
  NumberLineDistanceStrings.characterSet.unitedStatesOfAmericaStringProperty,
  new Image( person_png ),
  person_png,
  exploreHomeIcon_png,
  exploreNavbarIcon_png
);

export default ExplorerCharacterSetUSA;