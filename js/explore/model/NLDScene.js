// Copyright 2020, University of Colorado Boulder

/**
 * enum of possible scene values for the Number Line: Distance "Explore" screen
 *
 * @author Saurabh Totey
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineDistance from '../../numberLineDistance.js';

const NLDScene = Enumeration.byKeys( [ 'DISTANCE', 'TEMPERATURE', 'ELEVATION' ] );
numberLineDistance.register( 'NLDScene', NLDScene );
export default NLDScene;
