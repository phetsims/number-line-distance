// Copyright 2020, University of Colorado Boulder

/**
 * A point controller for the explore scenes of NLD
 * Only changes proposePosition so that the point controllers can freely leave their bounds if necessary
 *
 * @author Saurabh Totey
 */

import PointController from '../../../../number-line-common/js/common/model/PointController.js';
import numberLineDistance from '../../numberLineDistance.js';
import merge from '../../../../phet-core/js/merge.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';

class ExplorePointController extends PointController {

  /**
   * @param {function(Vector2):boolean} isPositionInBoundsFunction - a function that returns whether the given position
   *  is within some bounds of the explore scene; is used to determine when to detach point controllers and when to use
   *  the default 'proposePosition' function
   * @param {Object} [options]
   */
  constructor( isPositionInBoundsFunction, options ) {
    options = merge( { lockToNumberLine: LockToNumberLine.NEVER }, options );
    assert && assert( options.lockToNumberLine === LockToNumberLine.NEVER, 'lockToNumberLine should only be set to NEVER if set' );

    super( options );

    // @public (read-only)
    this.isPositionInBoundsFunction = isPositionInBoundsFunction;
  }

  /**
   * Does the normal proposePosition if the proposed position is
   * within the bounds (determined by given isPositionInBoundsFunction); otherwise just goes to the proposed position
   *
   * @override
   * @param {Vector2} proposedPosition
   * @public
   */
  proposePosition( proposedPosition ) {
    if ( this.isControllingNumberLinePoint() && this.isPositionInBoundsFunction( proposedPosition ) ) {
      super.proposePosition( proposedPosition );
    } else {
      this.positionProperty.value = proposedPosition;
    }
  }

}

numberLineDistance.register( 'ExplorePointController', ExplorePointController );
export default ExplorePointController;