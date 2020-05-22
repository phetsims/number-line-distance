// Copyright 2020, University of Colorado Boulder

/**
 * Model for common properties used by all scenes/screens in the sim
 *
 * @author Saurabh Totey
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import DistanceRepresentation from './DistanceRepresentation.js';
import numberLineDistance from '../../numberLineDistance.js';

class NLDModel {

  /**
   * @param {Tandem} tandem
   * @param {NumberLine} numberLine
   */
  constructor( tandem, numberLine ) {
    // @public {Property<Boolean>}
    this.pointLabelsVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.distanceLabelsVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.distanceDescriptionVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.tickMarksVisibleProperty = new BooleanProperty( false );

    // @public {Property<DistanceRepresentation>}
    this.distanceRepresentationProperty = new EnumerationProperty( DistanceRepresentation, DistanceRepresentation.ABSOLUTE );

    // @public {NumberLine}
    this.numberLine = numberLine;
  }

  /**
   * Resets the model
   */
  reset() {
    this.pointLabelsVisibleProperty.reset();
    this.distanceLabelsVisibleProperty.reset();
    this.distanceDescriptionVisibleProperty.reset();
    this.tickMarksVisibleProperty.reset();
    this.distanceRepresentationProperty.reset();
  }

}

numberLineDistance.register( 'NLDModel', NLDModel );
export default NLDModel;
