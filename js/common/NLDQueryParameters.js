// Copyright 2023, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Luisa Vargas
 */

import numberLineDistance from '../numberLineDistance.js';

export const USA_QUERY_VALUE = 'usa';
export const AFRICA_QUERY_VALUE = 'africa';
export const AFRICA_MODEST_QUERY_VALUE = 'africaModest';
export const ASIA_QUERY_VALUE = 'asia';
export const LATIN_AMERICA_QUERY_VALUE = 'latinAmerica';
export const MULTICULTURAL_QUERY_VALUE = 'multi';

const NumberLineDistanceQueryParameters = QueryStringMachine.getAll( {

  // This query parameter sets the region and culture portrayal for the sim. This changes the artwork for the character
  // sets that appear throughout the sim.
  regionAndCulture: {
    type: 'string',
    validValues: [ MULTICULTURAL_QUERY_VALUE, USA_QUERY_VALUE, AFRICA_QUERY_VALUE, AFRICA_MODEST_QUERY_VALUE, ASIA_QUERY_VALUE, LATIN_AMERICA_QUERY_VALUE ],
    defaultValue: MULTICULTURAL_QUERY_VALUE
  }
} );

numberLineDistance.register( 'NumberLineDistanceQueryParameters', NumberLineDistanceQueryParameters );

export default NumberLineDistanceQueryParameters;