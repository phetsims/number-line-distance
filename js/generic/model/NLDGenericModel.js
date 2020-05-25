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

class NLDGenericModel extends NLDModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center, {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 160
    } );
    super( tandem, numberLine );
    //TODO: change pointControllerBoxProperty bounds on orientation change
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
