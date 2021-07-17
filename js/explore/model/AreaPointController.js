// Copyright 2020-2021, University of Colorado Boulder

/**
 * A point controller for the temperature and elevation scenes of NLD that changes proposePosition so that the point
 * controllers can freely leave their bounds if necessary.
 *
 * @author Saurabh Totey
 */

import ExplorePointController from './ExplorePointController.js';
import numberLineDistance from '../../numberLineDistance.js';
import merge from '../../../../phet-core/js/merge.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';

class AreaPointController extends ExplorePointController {

  /**
   * @param {DropFromDirection} dropFromDirection - the direction from which the point controller can 'drop' onto the
   * play area
   * @param {Bounds2} playAreaBounds - the bounds where the point controller is allowed to interact with the number line
   * by having a number line point. Is used to determine when to detach point controllers and when to use the default
   * proposePosition function. Points are only attached when they are 'in bounds'.
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

    // TODO: see if this can be done more in proposePosition like DistancePointController
    this.positionProperty.link( position => {

      // If the point controller is dragged or dropped into the play area, create a number line point.
      if ( this.playAreaBounds.containsPoint( position )
        && !this.isControllingNumberLinePoint() &&
        ( this.isDraggingProperty.value || this.isDropping ) ) {
        const numberLinePoint = new NumberLinePoint( this.numberLines[ 0 ], {
          controller: this,
          initialValue: this.numberLines[ 0 ].getConstrainedValue( this.numberLines[ 0 ].modelPositionToValue( position ) ),
          initialColor: this.color
        } );
        this.numberLines[ 0 ].addPoint( numberLinePoint );
        this.associateWithNumberLinePoint( numberLinePoint );
        this.isDropping = false;
      }
      else if ( !this.playAreaBounds.containsPoint( position ) &&
        this.isControllingNumberLinePoint() ) {
        this.removeClearAndDisposePoints();
      }
    } );
  }

  /**
   * Does the normal proposePosition if the proposed position is within the bounds (determined by given
   * isPositionInBoundsFunction); otherwise just goes to the proposed position
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
        this.isDropping = true; // will be unset by AreaSceneModel
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
