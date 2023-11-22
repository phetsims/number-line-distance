// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */


import JoistStrings from '../../../../joist/js/JoistStrings.js';
import exploreHomeIcon_png from '../../../images/africa/exploreHomeIcon_png.js';
import exploreNavbarIcon_png from '../../../images/africa/exploreNavbarIcon_png.js';
import person_png from '../../../images/africa/person_png.js';
import { AFRICA_QUERY_VALUE } from '../NLDQueryParameters.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfrica = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaStringProperty,
  person_png,
  30,
  exploreHomeIcon_png,
  exploreNavbarIcon_png,
  AFRICA_QUERY_VALUE
);

export default ExplorerCharacterSetAfrica;