// Copyright 2020, University of Colorado Boulder

/**
 * Common functionality for scene models for the explore screen
 *
 * @author Saurabh Totey
 */

import NLDBaseModel from '../../common/model/NLDBaseModel.js';
import numberLineDistance from '../../numberLineDistance.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';

class SceneModel extends NLDBaseModel {

  /**
   * @param {Tandem} tandem
   * @param {SpatializedNumberLine} numberLine
   * @param {ExplorePointController[]} pointControllers
   */
  constructor( tandem, numberLine, pointControllers ) {
    super( tandem, numberLine, pointControllers );

    // Handles attaching and detaching number line points to the point controllers whenever they enter or leave the bounds
    pointControllers.forEach( pointController => {
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
