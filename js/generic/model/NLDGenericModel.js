// Copyright 2020, University of Colorado Boulder

/**
 * Main model for the 'Generic' screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDModel from '../../common/model/NLDModel.js';

class NLDGenericModel extends NLDModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );
    //TODO:
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
