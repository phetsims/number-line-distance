// Copyright 2020, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco
 */

import numberLineDistance from '../numberLineDistance.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import Range from '../../../dot/js/Range.js';

const NLDConstants = {

  NLD_LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  GENERIC_NUMBER_LINE_RANGES: [
    new Range( -10, 10 ),
    new Range( -30, 30 ),
    new Range( -100, 100 )
  ]

  //TODO
};

numberLineDistance.register( 'NLDConstants', NLDConstants );
export default NLDConstants;
