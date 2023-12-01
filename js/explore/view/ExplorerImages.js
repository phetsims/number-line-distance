// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for all images for the Explorer in this sim. Collects the images to support selecting a different
 * explorer character for localization.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../../numberLineDistance.js';
import ExplorerPortrayalAfrica from './portrayals/ExplorerPortrayalAfrica.js';
import ExplorerPortrayalAfricaModest from './portrayals/ExplorerPortrayalAfricaModest.js';
import ExplorerPortrayalAsia from './portrayals/ExplorerPortrayalAsia.js';
import ExplorerPortrayalLatinAmerica from './portrayals/ExplorerPortrayalLatinAmerica.js';
import ExplorerPortrayalMulticultural from './portrayals/ExplorerPortrayalMulticultural.js';
import ExplorerPortrayalOceania from './portrayals/ExplorerPortrayalOceania.js';
import ExplorerPortrayalUSA from './portrayals/ExplorerPortrayalUSA.js';

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