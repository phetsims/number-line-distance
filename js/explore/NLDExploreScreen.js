// Copyright 2020, University of Colorado Boulder

/**
 * the 'Explore' screen in the Number Line: Distance simulation
 *
 * @author Saurabh Totey
 */

import Screen from '../../../joist/js/Screen.js';
import numberLineDistanceStrings from '../numberLineDistanceStrings.js';
import Property from '../../../axon/js/Property.js';
import numberLineDistance from '../numberLineDistance.js';
import NLDExploreModel from './model/NLDExploreModel.js';
import NLDExploreScreenView from './view/NLDExploreScreenView.js';

const screenExploreString = numberLineDistanceStrings.screen.explore;

class NLDExploreScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @public
   */
  constructor( tandem ) {
    const options = {
      name: screenExploreString,
      backgroundColorProperty: new Property( 'rgb( 254, 247, 233 )' ),
      tandem: tandem
    };

    super( () => new NLDExploreModel(), model => new NLDExploreScreenView( model ), options );
  }

}

numberLineDistance.register( 'NLDExploreScreen', NLDExploreScreen );
export default NLDExploreScreen;
