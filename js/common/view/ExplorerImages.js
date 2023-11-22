// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for all images for the Explorer in this sim. Collects the images to support selecting a different
 * explorer character for localization.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../../numberLineDistance.js';
import ExplorerCharacterSetAfrica from './ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from './ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from './ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from './ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetMulti from './ExplorerCharacterSetMulti.js';
import ExplorerCharacterSetOceania from './ExplorerCharacterSetOceania.js';
import ExplorerCharacterSetUSA from './ExplorerCharacterSetUSA.js';

const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerCharacterSetMulti,
    ExplorerCharacterSetAfrica,
    ExplorerCharacterSetAfricaModest,
    ExplorerCharacterSetAsia,
    ExplorerCharacterSetLatinAmerica,
    ExplorerCharacterSetOceania,
    ExplorerCharacterSetUSA
  ]
};

numberLineDistance.register( 'ExplorerImages', ExplorerImages );
export default ExplorerImages;