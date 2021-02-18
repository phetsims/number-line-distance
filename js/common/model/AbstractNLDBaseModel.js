// Copyright 2020, University of Colorado Boulder

/**
 * Model for common properties/behaviours used by all scenes/screens in the sim.
 * This class is incomplete and meant to be subclassed.
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
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';

class AbstractNLDBaseModel {

  // REVIEW: It seems a little strange that the number line and point controllers aren't just created in this
  //         constructor rather than being passed in.  This might be due to some constraints with the relationships of
  //         point controllers and number lines, and if so, so be it.  But it would worth looking at to see if more of
  //         the work can be done here.
  // REVIEW: Our convention thus far has been to make the tandem the last parameter prior to the options rather than the
  //         first one.
  /**
   * This constructor initializes common values and properties for the model.
   * Parameters require two point controllers because every screen/scene in this sim has two point controllers.
   *
   * @param {Tandem} tandem
   * @param {SpatializedNumberLine} numberLine
   * @param {PointController} pointControllerOne
   * @param {PointController} pointControllerTwo
   * @param {Object} [options]
   */
  constructor( tandem, numberLine, pointControllerOne, pointControllerTwo, options ) {

    // @private
    this.options = merge( {
      positionInBoxOffset: new Vector2( 0, 0 )
    }, options );

    // @public {Property.<Boolean>}
    this.distanceLabelsVisibleProperty = new BooleanProperty( true );

    // @public {Property.<Boolean>}
    this.distanceDescriptionVisibleProperty = new BooleanProperty( true );

    // @public {Property.<DistanceRepresentation>}
    this.distanceRepresentationProperty = new EnumerationProperty( DistanceRepresentation, DistanceRepresentation.ABSOLUTE );

    // @public {Property.<Boolean>} - whether the x_1 and x_2 or y_1 and y_2 nodes are swapped
    // an 'isSwapped' approach was taken rather than reordering the point controllers in some array because it is
    // often useful to know which point controller is which and to be able to consistently access the same point controller
    this.isPrimaryControllerSwappedProperty = new BooleanProperty( false );

    // @public {SpatializedNumberLine}
    this.numberLine = numberLine;

    // @public {PointController} - the point controllers in the sim; this.pointControllerOne is the 'primary' point controller
    // unless this.isPrimaryNodeSwappedProperty in which case this.pointControllerTwo is the 'primary' point controller
    // ordering of point controllers is necessary for all sorts of behaviours in this sim (e.g. directed distance,
    // distance statements, etc.)
    this.pointControllerOne = pointControllerOne;
    this.pointControllerTwo = pointControllerTwo;

    // @public {Property.<Bounds2>} the bounds of the toolbox that point controllers return to
    // can change with numberline orientation
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
          pointController.setPositionRelativeToPoint( pointController.numberLinePoints.get( 0 ) );
        } );
    } );

    // if point controllers were in the box and the box bounds changed, move the points
    this.pointControllerBoxProperty.lazyLink( ( newBoxBounds, oldBoxBounds ) => {
      this.pointControllers.forEach( pointController => {

        // if the point controller is animating, stop it and put it in the box
        if ( pointController.inProgressAnimationProperty.value ) {
          pointController.stopAnimation();
          this.putPointControllerInBox( pointController );
        }

        // if the point controller was sitting in the previous box, move it to the new one
        else if ( oldBoxBounds.containsPoint( pointController.positionProperty.value ) &&
                  !pointController.isDraggingProperty.value && !pointController.isControllingNumberLinePoint() ) {
          this.putPointControllerInBox( pointController );
        }
      } );
    } );
  }

  /**
   * Place the provided point controller into the currently active box.
   * Generally done on init, reset, and when the user "puts it away".
   *
   * @param {PointController} pointController
   * @param {boolean} [animate] - controls whether to animate the return to the box or do it instantly
   * @private
   */
  putPointControllerInBox( pointController, animate = false ) {

    const index = this.pointControllers.indexOf( pointController );
    const numberOfPositions = this.pointControllers.length;

    // error checking
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
      ).plus( this.options.positionInBoxOffset );
    }
    else if ( this.pointControllerBoxProperty.value === NLDConstants.SIDE_BOX_BOUNDS ) {

      // put point in box at side of screen
      const spacing = NLDConstants.SIDE_BOX_BOUNDS.height / numberOfPositions;
      destination = new Vector2(
        NLDConstants.SIDE_BOX_BOUNDS.centerX,
        NLDConstants.SIDE_BOX_BOUNDS.minY + spacing / 2 + spacing * index
      ).plus( this.options.positionInBoxOffset );
    }
    else {
      assert && assert( false, 'cannot put point controller away if box is not the bottom box or side box' );
    }

    pointController.goToPosition( destination, animate );
  }

  /**
   * Get both point controllers as a list.
   * Always returns this.pointControllerOne as the first element of the list, which means that this method
   * doesn't order the point controllers by which one is the primary one.
   *
   * @returns {PointController[]}
   * @public
   */
  getPointControllers() {
    return [ this.pointControllerOne, this.pointControllerTwo ];
  }
  get pointControllers() { return this.getPointControllers(); }

  /**
   * A function that returns whether both point controllers are controlling number line points that live on the numberline
   * @public
   */
  areBothPointControllersControllingOnNumberLine() {
    return this.pointControllers.every( pointController => {
      if ( !pointController.isControllingNumberLinePoint() ) {
        return false;
      }
      const numberLinePoint = pointController.numberLinePoints.get( 0 );
      return this.numberLine.hasPoint( numberLinePoint );
    } );
  }

  /**
   * Resets the model
   * @public
   */
  reset() {
    this.pointControllers.forEach( pointController => {
      pointController.reset();
      this.putPointControllerInBox( pointController );
    } );
    this.distanceLabelsVisibleProperty.reset();
    this.distanceDescriptionVisibleProperty.reset();
    this.distanceRepresentationProperty.reset();
    this.isPrimaryControllerSwappedProperty.reset();
    this.numberLine.reset();
    this.pointControllerBoxProperty.reset();
  }

}

numberLineDistance.register( 'AbstractNLDBaseModel', AbstractNLDBaseModel );
export default AbstractNLDBaseModel;
