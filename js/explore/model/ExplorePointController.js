// Copyright 2021, University of Colorado Boulder

/**
 * A point controller with 'dropping' behaviour: if a point controller is dragged to a side of the play area,
 *  it 'drops' to the play area rather than returning to the box.
 *
 * @author Saurabh Totey
 */

import PointController from '../../../../number-line-common/js/common/model/PointController.js';
import numberLineDistance from '../../numberLineDistance.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class ExplorePointController extends PointController {

  /**
   * TODO: doc
   *
   * @param {string} dropFromDirection -- TODO: make this an enum
   * @param {Bounds2} playAreaBounds
   * @param {Object} [options]
   */
  constructor( dropFromDirection, playAreaBounds, options ) {
    super( options );

    // @private - Returns where this point controller should 'drop' to from the given position.
    // If the point controller is not in a place where it can drop to the play area, it just returns the
    // given position.
    // The dropping behaviour is desired for #34.
    this.isDraggingProperty.link( isDragging => {
      if ( isDragging ) {
        return;
      }
      const position = this.positionProperty.value;
      if ( dropFromDirection === 'top' && position.y < playAreaBounds.minY &&
        playAreaBounds.minX <= position.x && position.x <= playAreaBounds.maxX ) {
        this.proposePosition( new Vector2( position.x, playAreaBounds.minY ) );
      }
      else if ( dropFromDirection === 'left' && position.x < playAreaBounds.minX &&
        playAreaBounds.minY <= position.y && position.y <= playAreaBounds.maxY ) {
        this.proposePosition( new Vector2( playAreaBounds.minX, position.y ) );
      }
    } );
  }

}

numberLineDistance.register( 'ExplorePointController', ExplorePointController );
export default ExplorePointController;
