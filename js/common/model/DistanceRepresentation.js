// Copyright 2020, University of Colorado Boulder

/**
 * An enumeration of how distance will be represented.
 * Absolute is unsigned distance and directed is signed distance.
 *
 * @author Saurabh Totey
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineDistance from '../../numberLineDistance.js';

const DistanceRepresentation = Enumeration.byKeys( [ 'ABSOLUTE', 'DIRECTED' ] );
numberLineDistance.register( 'DistanceRepresentation', DistanceRepresentation );
export default DistanceRepresentation;
