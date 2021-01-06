// Copyright 2020, University of Colorado Boulder

/**
 * A model with common functionality for scene models for the explore screen.
 *
 * @author Saurabh Totey
 */

import AbstractNLDBaseModel from '../../common/model/AbstractNLDBaseModel.js';
import numberLineDistance from '../../numberLineDistance.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';

class SceneModel extends AbstractNLDBaseModel {

  /**
   * @param {Tandem} tandem
   * @param {SpatializedNumberLine} numberLine
   * @param {ExplorePointController} pointControllerOne
   * @param {ExplorePointController} pointControllerTwo
   * @param {Object} [options]
   */
  constructor( tandem, numberLine, pointControllerOne, pointControllerTwo, options ) {
    super( tandem, numberLine, pointControllerOne, pointControllerTwo, options );

    // Handles attaching and detaching number line points to the point controllers whenever they enter or leave the bounds
    this.pointControllers.forEach( pointController => {
      pointController.positionProperty.link( position => {
        if ( pointController.isPositionInBoundsFunction( position )
             && !pointController.isControllingNumberLinePoint() && pointController.isDraggingProperty.value ) {
          const numberLinePoint = new NumberLinePoint( numberLine, {
            controller: pointController,
            initialValue: numberLine.modelPositionToValue( position ),
            initialColor: pointController.color
          } );
          numberLine.addPoint( numberLinePoint );
          pointController.associateWithNumberLinePoint( numberLinePoint );
        }
        else if ( !pointController.isPositionInBoundsFunction( position )
                  && pointController.isControllingNumberLinePoint() ) {
          pointController.removePointsFromNumberLines();
          pointController.clearNumberLinePoints();
        }
      } );
    } );
  }

}

numberLineDistance.register( 'SceneModel', SceneModel );

export default SceneModel;
