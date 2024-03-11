// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the Latin America region and culture portrayals.
 *
 * @author Luisa Vargas
 *
 */

import latinAmericaExploreHomeIcon_png from '../../../../images/latinAmerica/latinAmericaExploreHomeIcon_png.js';
import latinAmericaExploreNavbarIcon_png from '../../../../images/latinAmerica/latinAmericaExploreNavbarIcon_png.js';
import latinAmericaPerson_png from '../../../../images/latinAmerica/latinAmericaPerson_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalLatinAmerica = new ExplorerPortrayal(
  'latinAmerica',
  latinAmericaPerson_png,
  35,
  latinAmericaExploreHomeIcon_png,
  latinAmericaExploreNavbarIcon_png
);

export default ExplorerPortrayalLatinAmerica;