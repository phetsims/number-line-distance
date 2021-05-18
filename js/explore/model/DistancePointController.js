// Copyright 2021, University of Colorado Boulder

/**
 * A point controller for the distance scene of NLD.
 * This point controller locks on to the numberline when in the trapezoid's bounds, and unlocks when outside.
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import PointController from '../../../../number-line-common/js/common/model/PointController.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';

class DistancePointController extends PointController {

  /**
   * @param {SpatializedNumberLine} numberLine
   * @param {Shape} containingShape - the point controller will lock on to the number line if in the containingShape's bounds
   * @param {number} lockHeight
   * @param {number} scaleInBox
   */
  constructor( numberLine, containingShape, lockHeight, scaleInBox ) {
    super( {
      numberLines: [ numberLine ],
      lockToNumberLine: LockToNumberLine.WHEN_CLOSE,
      offsetFromHorizontalNumberLine: lockHeight,
      scaleInBox: scaleInBox
    } );

    // @private
    this.lockingBounds = containingShape.bounds.withMinY( numberLine.centerPositionProperty.value.y );
  }

  /**
   * Performs the normal proposePosition assuming that this only has one number line and is always
   * locked to the number line when close. There is a small change that the locking behaviour
   * doesn't depend on distance from the number line but rather on whether this point controller is
   * within this.lockingBounds.
   *
   * @override
   * @param {Vector2} proposedPosition
   * @public
   */
  proposePosition( proposedPosition ) {
    if ( this.isControllingNumberLinePoint() ) {
      const point = this.numberLinePoints[ 0 ];

      // Map the proposed position to a value on the number line.
      const proposedNumberLineValue = point.numberLine.modelPositionToValue( proposedPosition );

      // Determine whether to propose a new value for the point or to detach and remove the point.
      if ( this.lockingBounds.containsPoint( proposedPosition ) ) {
        point.proposeValue( proposedNumberLineValue );
      }
      else {
        point.numberLine.removePoint( point );
        this.dissociateFromNumberLinePoint( point );
      }
    }
    else {

      // Check if a point should be created and added based on the proposed position.
      if ( this.lockingBounds.containsPoint( proposedPosition ) ) {
        const numberLine = this.numberLines[ 0 ];
        const constrainedValue = numberLine.getConstrainedValue( numberLine.modelPositionToValue( proposedPosition ) );
        const numberLinePoint = new NumberLinePoint( numberLine, {
          initialValue: constrainedValue,
          initialColor: this.color,
          controller: this
        } );
        numberLine.addPoint( numberLinePoint );
        this.associateWithNumberLinePoint( numberLinePoint );
      }
      else {

        // Just accept the proposed position, no other action is necessary.
        this.goToPosition( proposedPosition );
      }
    }
  }

}

numberLineDistance.register( 'DistancePointController', DistancePointController );
export default DistancePointController;
