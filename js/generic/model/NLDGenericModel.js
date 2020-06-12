// Copyright 2020, University of Colorado Boulder

/**
 * Main model for the 'Generic' screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDBaseModel from '../../common/model/NLDBaseModel.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PointController from '../../../../number-line-common/js/common/model/PointController.js';

class NLDGenericModel extends NLDBaseModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( 0, 50 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 185,
      initialDisplayedRange: NLDConstants.GENERIC_NUMBER_LINE_RANGES[ 0 ]
    } );

    const pointControllers = [
      new PointController( {
        numberLines: [ numberLine ],
        color: 'magenta'
      } ),
      new PointController( {
        numberLines: [ numberLine ],
        color: 'blue'
      } )
    ];

    super( tandem, numberLine, pointControllers );

    // change box bounds when number line orientation changes
    this.numberLine.orientationProperty.link( orientation => {
      this.pointControllerBoxProperty.value = ( orientation === Orientation.HORIZONTAL ) ?
        NLDConstants.BOTTOM_BOX_BOUNDS : NLDConstants.SIDE_BOX_BOUNDS;
    } );
  }

}

numberLineDistance.register( 'NLDGenericModel', NLDGenericModel );
export default NLDGenericModel;
