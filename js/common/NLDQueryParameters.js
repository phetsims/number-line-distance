// Copyright 2023, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../numberLineDistance.js';

export const USA_QUERY_VALUE = 'usa';

const NumberLineDistanceQueryParameters = QueryStringMachine.getAll( {

  // This query parameter sets the region and culture portrayal for the sim. This changes the artwork for the character
  // sets that appear throughout the sim.
  regionAndCulture: {
    type: 'string',
    validValues: [ USA_QUERY_VALUE ],
    defaultValue: USA_QUERY_VALUE
  }
} );

numberLineDistance.register( 'NumberLineDistanceQueryParameters', NumberLineDistanceQueryParameters );

export default NumberLineDistanceQueryParameters;