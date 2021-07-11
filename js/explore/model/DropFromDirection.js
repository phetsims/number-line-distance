// Copyright 2021, University of Colorado Boulder

/**
 * Represents from where a point controller should 'drop' onto a number line for #34.
 * For example, if a point controller is above a play area and the DropFromDirection is TOP, then
 * the point controller will 'fall' onto the play area instead of being sent to the box.
 *
 * @author Saurabh Totey
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberLineCommon from '../../numberLineDistance.js';

// @public
const DropFromDirection = Enumeration.byKeys( [ 'TOP', 'LEFT' ] );

numberLineCommon.register( 'DropFromDirection', DropFromDirection );
export default DropFromDirection;
