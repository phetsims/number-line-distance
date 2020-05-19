// Copyright 2020, University of Colorado Boulder

/**
 * View of the 'Explore' screen for the Number Line Distance simulation
 *
 * @author Saurabh Totey
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import numberLineDistance from '../../numberLineDistance.js';

class NLDExploreScreenView extends ScreenView {

  /**
   * TODO:
   * @param {NLDExploreModel} model
   */
  constructor( model ) {
    super();
  }

}

numberLineDistance.register( 'NLDExploreScreenView', NLDExploreScreenView );
export default NLDExploreScreenView;
