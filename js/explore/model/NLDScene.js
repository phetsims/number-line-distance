// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration of possible scene values for the Number Line: Distance "Explore" screen.
 * TODO: distance scene refers to the scene with the house and the person, but the
 *  name 'distance scene' isn't terriby descriptive/useful
 *
 * @author Saurabh Totey
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineDistance from '../../numberLineDistance.js';

const NLDScene = Enumeration.byKeys( [ 'DISTANCE', 'TEMPERATURE', 'ELEVATION' ] );
numberLineDistance.register( 'NLDScene', NLDScene );
export default NLDScene;
