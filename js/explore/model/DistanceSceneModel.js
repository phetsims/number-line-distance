// Copyright 2020, University of Colorado Boulder

/**
 * Model for the 'Distance' scene
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import ExplorePointController from './ExplorePointController.js';
import SceneModel from './SceneModel.js';
import Shape from '../../../../kite/js/Shape.js';

// constants
const TRAPEZOID_OFFSET_FROM_NUMBERLINE = 125;
const TRAPEZOID_HEIGHT = 50;

class DistanceSceneModel extends SceneModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // values empirically determined
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( 0, -75 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 250,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 160,
      labelsInitiallyVisible: true,
      tickMarksInitiallyVisible: true
    } );

    // constants used for determining the trapezoid plane shape
    const numberLineMinimumXPosition = numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.min ).x;
    const numberLineMaximumXPosition =  numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.max ).x;
    const numberLineY = numberLine.centerPositionProperty.value.y;

    // REVIEW: In reference to the TODO below, when I (jbphet) look at the design doc, I don't think the outer edges of
    //         the trapezoidal shape are meant to be significant.  I think the top portion should span the size of the
    //         number line and the bottom be somewhat wider.  Any value in the number line's range should be legit when
    //         the point controller is between the top and bottom of the trapezoid shape.  Also, once a point is added,
    //         the point controller should move itself vertically to the center of the trapezoid.

    // TODO: this needs more reworking
    //  all constants are empirically determined, but the locking behaviour feels wonky
    //  might require instead reworking isPositionInPlaneFunction
    const planeTrapezoidShape = new Shape()
      .moveTo( numberLineMinimumXPosition - 50, numberLineY + TRAPEZOID_OFFSET_FROM_NUMBERLINE + TRAPEZOID_HEIGHT )
      .lineTo( numberLineMaximumXPosition + 50, numberLineY + TRAPEZOID_OFFSET_FROM_NUMBERLINE + TRAPEZOID_HEIGHT )
      .lineTo( numberLineMaximumXPosition - 50, numberLineY + TRAPEZOID_OFFSET_FROM_NUMBERLINE )
      .lineTo( numberLineMinimumXPosition + 50, numberLineY + TRAPEZOID_OFFSET_FROM_NUMBERLINE )
      .close();

    const isPositionInPlaneFunction = position => planeTrapezoidShape.containsPoint( position );

    super(
      tandem,
      numberLine,
      new ExplorePointController( isPositionInPlaneFunction, {
        numberLines: [ numberLine ]
      } ),
      new ExplorePointController( isPositionInPlaneFunction, {
        numberLines: [ numberLine ]
      } )
    );

    // @public (read-only)
    this.planeTrapezoidShape = planeTrapezoidShape;
  }
}

numberLineDistance.register( 'DistanceSceneModel', DistanceSceneModel );
export default DistanceSceneModel;
