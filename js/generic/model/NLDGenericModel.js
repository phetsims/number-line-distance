// Copyright 2020, University of Colorado Boulder

/**
 * Main model for the 'Generic' screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDModel from '../../common/model/NLDModel.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import Orientation from '../../../../phet-core/js/Orientation.js';

class NLDGenericModel extends NLDModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center, {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 160,
      initialDisplayedRange: NLDConstants.GENERIC_NUMBER_LINE_RANGES[ 0 ]
    } );
    super( tandem, numberLine );

    this.numberLine.orientationProperty.link( orientation => {
      this.pointControllerBoxProperty.value = ( orientation === Orientation.HORIZONTAL ) ?
        NLDConstants.BOTTOM_BOX_BOUNDS : NLDConstants.SIDE_BOX_BOUNDS;
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    super.reset();
    //TODO:
  }

}

numberLineDistance.register( 'NLDGenericModel', NLDGenericModel );
export default NLDGenericModel;
