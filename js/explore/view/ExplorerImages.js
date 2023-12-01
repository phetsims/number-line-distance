// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for all images for the Explorer in this sim. Collects the images to support selecting a different
 * explorer character for localization.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../../numberLineDistance.js';
import ExplorerPortrayalAfrica from './characterSets/ExplorerPortrayalAfrica.js';
import ExplorerPortrayalAfricaModest from './characterSets/ExplorerPortrayalAfricaModest.js';
import ExplorerPortrayalAsia from './characterSets/ExplorerPortrayalAsia.js';
import ExplorerPortrayalLatinAmerica from './characterSets/ExplorerPortrayalLatinAmerica.js';
import ExplorerPortrayalMulticultural from './characterSets/ExplorerPortrayalMulticultural.js';
import ExplorerPortrayalOceania from './characterSets/ExplorerPortrayalOceania.js';
import ExplorerPortrayalUSA from './characterSets/ExplorerPortrayalUSA.js';

const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerPortrayalMulticultural,
    ExplorerPortrayalAfrica,
    ExplorerPortrayalAfricaModest,
    ExplorerPortrayalAsia,
    ExplorerPortrayalLatinAmerica,
    ExplorerPortrayalOceania,
    ExplorerPortrayalUSA
  ]
};

numberLineDistance.register( 'ExplorerImages', ExplorerImages );
export default ExplorerImages;