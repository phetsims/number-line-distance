// Copyright 2020, University of Colorado Boulder

/**
 * Model for common properties used by all scenes/screens in the sim
 *
 * @author Saurabh Totey
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import DistanceRepresentation from './DistanceRepresentation.js';
import numberLineDistance from '../../numberLineDistance.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NLDConstants from '../NLDConstants.js';
import PointController from '../../../../number-line-integers/js/common/model/PointController.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class NLDModel {

  /**
   * @param {Tandem} tandem
   * @param {SpatializedNumberLine} numberLine
   */
  constructor( tandem, numberLine ) {
    // @public {Property<Boolean>}
    this.distanceLabelsVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.distanceDescriptionVisibleProperty = new BooleanProperty( false );

    // @public {Property<DistanceRepresentation>}
    this.distanceRepresentationProperty = new EnumerationProperty( DistanceRepresentation, DistanceRepresentation.ABSOLUTE );

    // @public {Property<Boolean>} - whether the x_1 and x_2 or y_1 and y_2 nodes are swapped
    this.isPrimaryNodeSwappedProperty = new BooleanProperty( false );

    // @public {SpatializedNumberLine}
    this.numberLine = numberLine;

    const pointControllerOptions = { numberLines: [ this.numberLine ] };

    // @public {PointController[]}
    this.pointControllers = [ new PointController( pointControllerOptions ), new PointController( pointControllerOptions ) ];

    // @public {Property<Bounds2>} the bounds of the toolbox that point controllers return to; can change with numberline orientation
    this.pointControllerBoxProperty = new Property( NLDConstants.BOTTOM_BOX_BOUNDS, { valueType: Bounds2 } );

    this.pointControllers.forEach( pointController => {

      this.putPointControllerInBox( pointController );

      // Set up the listeners that will place the point controllers back in their default positions when released over
      // the active point controller box.
      pointController.isDraggingProperty.lazyLink( dragging => {

        // if the point controller is released and it's not controlling a point on the number line, put it away
        if ( !dragging && !pointController.isControllingNumberLinePoint() ) {
          this.putPointControllerInBox( pointController, true );
        }
      } );

    } );

    // manage point controllers on orientation change
    this.numberLine.orientationProperty.lazyLink( () => {
      this.pointControllers
        .filter( pointController => pointController.isControllingNumberLinePoint() )
        .forEach( pointController => {
          // there should only be one controlled point
          assert && assert( pointController.numberLinePoints.length === 1 );
          pointController.setPositionRelativeToPoint( pointController.numberLinePoints[ 0 ] );
        } );
    } );

    // if point controllers were in the box and the box bounds changed, move the points
    this.pointControllerBoxProperty.lazyLink( ( newBoxBounds, oldBoxBounds ) => {
      this.pointControllerBoxProperty.value = newBoxBounds;
      this.pointControllers.forEach( pointController => {

        // if the point controller is animating, stop it and put it in the box
        if ( pointController.inProgressAnimationProperty.value ) {
          pointController.stopAnimation();
          this.putPointControllerInBox( pointController );
        }

        // if the point controller was sitting in the previous box, move it to the new one
        else if ( oldBoxBounds.containsPoint( pointController.positionProperty.value ) &&
          !pointController.isDraggingProperty.value ) {
          this.putPointControllerInBox( pointController );
        }
      } );
    } );

    // Add a listener to handle any cases where a change to the number line's display range causes a point that was
    // already on the number line to be outside of the displayed range.
    this.numberLine.displayedRangeProperty.lazyLink( displayedRange => {
      this.pointControllers.forEach( pointController => {
        if ( pointController.isControllingNumberLinePoint() ) {

          // state checking
          assert && assert(
            pointController.numberLinePoints.length === 1,
            'point controllers on the "Generic" screen should never control multiple points'
          );

          // get the point on the number line that is currently controlled by this point controller
          const numberLinePoint = pointController.numberLinePoints[ 0 ];

          if ( !displayedRange.contains( numberLinePoint.valueProperty.value ) ) {

            // the point controlled by this controller is out of the displayed range, so get rid of it
            pointController.dissociateFromNumberLinePoint( numberLinePoint );
            this.numberLine.removePoint( numberLinePoint );

            // put the controller away
            this.putPointControllerInBox( pointController );
          }
        }
      } );
    } );
  }

  /**
   * place the provided point controller into the currently active box, generally done on init, reset, and when the
   * user "puts it away"
   * @param {PointController} pointController
   * @param {boolean} [animate] - controls whether to animate the return to the box or do it instantly
   * @private
   */
  putPointControllerInBox( pointController, animate = false ) {

    const index = this.pointControllers.indexOf( pointController );
    const numberOfPositions = this.pointControllers.length;

    // error checking
    assert && assert( numberOfPositions === 2, 'all models in NLD should have 2 point controllers' );
    assert && assert( index >= 0, 'point controller not found on list' );
    assert && assert(
      !pointController.isControllingNumberLinePoint(),
      'point controller should not be put away while controlling a point'
    );

    let destination;

    // decide which box and at which position the point controller should be placed
    if ( this.pointControllerBoxProperty.value === NLDConstants.BOTTOM_BOX_BOUNDS ) {

      // put point in box at bottom of screen
      const spacing = NLDConstants.BOTTOM_BOX_BOUNDS.width / numberOfPositions;
      destination = new Vector2(
        NLDConstants.BOTTOM_BOX_BOUNDS.minX + spacing / 2 + spacing * index,
        NLDConstants.BOTTOM_BOX_BOUNDS.centerY
      );
    }
    else if ( this.pointControllerBoxProperty.value === NLDConstants.SIDE_BOX_BOUNDS ) {

      // put point in box at side of screen
      const spacing = NLDConstants.SIDE_BOX_BOUNDS.height / numberOfPositions;
      destination = new Vector2(
        NLDConstants.SIDE_BOX_BOUNDS.centerX,
        NLDConstants.SIDE_BOX_BOUNDS.minY + spacing / 2 + spacing * index
      );
    }
    else {
      assert && assert( false, 'cannot put point controller away if box is not the bottom box or side box' );
    }

    pointController.goToPosition( destination, animate );
  }

  /**
   * Resets the model
   */
  reset() {
    this.distanceLabelsVisibleProperty.reset();
    this.distanceDescriptionVisibleProperty.reset();
    this.distanceRepresentationProperty.reset();
    this.isPrimaryNodeSwappedProperty.reset();
    this.numberLine.reset();
    this.pointControllerBoxProperty.reset();
  }

}

numberLineDistance.register( 'NLDModel', NLDModel );
export default NLDModel;
