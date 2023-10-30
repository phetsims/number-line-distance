// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for all images for the Explorer in this sim. Collects the images to support selecting a different
 * explorer character for localization.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../../numberLineDistance.js';
import ExplorerCharacterSetUSA from './ExplorerCharacterSetUSA.js';


const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerCharacterSetUSA
  ]
};

numberLineDistance.register( 'ExplorerImages', ExplorerImages );
export default ExplorerImages;