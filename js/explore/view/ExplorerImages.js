// Copyright 2023, University of Colorado Boulder

/**
 * Responsible for all images for the Explorer in this sim. Collects the images to support selecting a different
 * explorer character for localization.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../../numberLineDistance.js';
import ExplorerCharacterSetAfrica from './characterSets/ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from './characterSets/ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from './characterSets/ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from './characterSets/ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetMulti from './characterSets/ExplorerCharacterSetMulti.js';
import ExplorerCharacterSetOceania from './characterSets/ExplorerCharacterSetOceania.js';
import ExplorerCharacterSetUSA from './characterSets/ExplorerCharacterSetUSA.js';

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