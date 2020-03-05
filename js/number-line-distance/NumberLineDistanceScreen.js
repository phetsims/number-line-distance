// Copyright 2020, University of Colorado Boulder

/**
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import numberLineDistance from '../numberLineDistance.js';
import NumberLineDistanceModel from './model/NumberLineDistanceModel.js';
import NumberLineDistanceScreenView from './view/NumberLineDistanceScreenView.js';

class NumberLineDistanceScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem
    };

    super(
      () => new NumberLineDistanceModel( tandem.createTandem( 'model' ) ),
      model => new NumberLineDistanceScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberLineDistance.register( 'NumberLineDistanceScreen', NumberLineDistanceScreen );
export default NumberLineDistanceScreen;