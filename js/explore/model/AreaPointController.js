// Copyright 2020-2021, University of Colorado Boulder

/**
 * A point controller for the temperature and elevation scenes of NLD;
 * this PointController subclass only changes proposePosition so that
 * the point controllers can freely leave their bounds if necessary.
 *
 * @author Saurabh Totey
 */

import ExplorePointController from './ExplorePointController.js';
import numberLineDistance from '../../numberLineDistance.js';
import merge from '../../../../phet-core/js/merge.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';

class AreaPointController extends ExplorePointController {

  /**
   * @param {string} dropFromDirection - TODO: doc
   * @param {Bounds2} playAreaBounds - the bounds where the point controller is allowed to interact with the number line by
   * having a number line point. Is used to determine when to detach point controllers and when to use
   * the default 'proposePosition' function. Points are only attached when they are 'in bounds'.
   * @param {Object} [options]
   */
  constructor( dropFromDirection, playAreaBounds, options ) {
    options = merge( { lockToNumberLine: LockToNumberLine.NEVER }, options );
    assert && assert( options.lockToNumberLine === LockToNumberLine.NEVER, 'lockToNumberLine should only be set to NEVER if set' );

    super( dropFromDirection, playAreaBounds, options );

    // @public {boolean} a flag that denotes whether this point controller is 'dropping' for #34
    this.isDropping = false;

    // @public (read-only) {Bounds2}
    this.playAreaBounds = playAreaBounds;
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
    if ( this.playAreaBounds.containsPoint( proposedPosition ) ) {
      if ( this.isControllingNumberLinePoint() ) {
        super.proposePosition( proposedPosition );
      }
      else {
        this.isDropping = true;
        this.positionProperty.value = proposedPosition;
      }
    }
    else {
      this.positionProperty.value = proposedPosition;
    }
  }

}

numberLineDistance.register( 'AreaPointController', AreaPointController );
export default AreaPointController;
