// Copyright 2020, University of Colorado Boulder

/**
 * View of the 'Generic' screen for the Number Line Distance simulation
 *
 * @author Saurabh Totey
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import numberLineDistance from '../../numberLineDistance.js';

class NLDGenericScreenView extends ScreenView {

  /**
   * TODO:
   * @param {NLDGenericModel} model
   */
  constructor( model ) {
    super();
  }

}

numberLineDistance.register( 'NLDGenericScreenView', NLDGenericScreenView );
export default NLDGenericScreenView;
