// Copyright 2020, University of Colorado Boulder

/**
 * enum of how distance will be represented
 *
 * @author Saurabh Totey
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineDistance from '../../numberLineDistance.js';

const DistanceType = Enumeration.byKeys( [ 'ABSOLUTE', 'DIRECTED' ] );
numberLineDistance.register( 'DistanceType', DistanceType );
export default DistanceType;
