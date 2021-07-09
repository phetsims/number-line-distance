// Copyright 2020-2021, University of Colorado Boulder

/**
 * A model with common functionality for the temperature and elevation scenes where
 * the point controller can be freely moved within an area (PointController is an AreaPointController).
 *
 * @author Saurabh Totey
 */

import AbstractNLDBaseModel from '../../common/model/AbstractNLDBaseModel.js';
import numberLineDistance from '../../numberLineDistance.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';

class AreaSceneModel extends AbstractNLDBaseModel {

  /**
   * @param {SpatializedNumberLine} numberLine
   * @param {AreaPointController} pointControllerOne
   * @param {AreaPointController} pointControllerTwo
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( numberLine, pointControllerOne, pointControllerTwo, tandem, options ) {
    super( numberLine, pointControllerOne, pointControllerTwo, tandem, options );

    // Handle attaching and detaching number line points to the point controllers whenever they enter or leave the bounds.
    this.pointControllers.forEach( pointController => {
      pointController.positionProperty.link( position => {
        if ( pointController.playAreaBounds.containsPoint( position )
             && !pointController.isControllingNumberLinePoint() && pointController.isDraggingProperty.value ) {
          const numberLinePoint = new NumberLinePoint( numberLine, {
            controller: pointController,
            initialValue: numberLine.modelPositionToValue( position ),
            initialColor: pointController.color
          } );
          numberLine.addPoint( numberLinePoint );
          pointController.associateWithNumberLinePoint( numberLinePoint );
        }
        else if ( !pointController.playAreaBounds.containsPoint( position )
                  && pointController.isControllingNumberLinePoint() ) {
          pointController.removeClearAndDisposePoints();
        }
      } );
    } );
  }

}

numberLineDistance.register( 'AreaSceneModel', AreaSceneModel );
export default AreaSceneModel;
