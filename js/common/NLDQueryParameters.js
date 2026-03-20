// Copyright 2023-2026, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Luisa Vargas
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const NumberLineDistanceQueryParameters = QueryStringMachine.getAll( {

  terminology: {
    type: 'string',
    validValues: [ 'directedDistance', 'displacement' ],
    defaultValue: 'directedDistance'
  }
} );

export default NumberLineDistanceQueryParameters;
