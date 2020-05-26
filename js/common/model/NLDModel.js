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
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NLDConstants from '../NLDConstants.js';

class NLDModel {

  /**
   * @param {Tandem} tandem
   * @param {SpatializedNumberLine} numberLine
   */
  constructor( tandem, numberLine ) {
    // @public {Property<Boolean>}
    this.distanceLabelsVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.distanceDescriptionVisibleProperty = new BooleanProperty( false );

    // @public {Property<DistanceRepresentation>}
    this.distanceRepresentationProperty = new EnumerationProperty( DistanceRepresentation, DistanceRepresentation.ABSOLUTE );

    // @public {Property<Boolean>} - whether the x_1 and x_2 or y_1 and y_2 nodes are swapped
    this.isPrimaryNodeSwappedProperty = new BooleanProperty( false );

    // @public {SpatializedNumberLine}
    this.numberLine = numberLine;

    // @public {Property<Bounds2>} the bounds of the toolbox that point controllers return to; can change with numberline orientation
    this.pointControllerBoxProperty = new Property( NLDConstants.BOTTOM_BOX_BOUNDS, { valueType: Bounds2 } );

    //TODO: move point controllers on pointControllerBoxProperty change
  }

  /**
   * Resets the model
   */
  reset() {
    this.distanceLabelsVisibleProperty.reset();
    this.distanceDescriptionVisibleProperty.reset();
    this.distanceRepresentationProperty.reset();
    this.isPrimaryNodeSwappedProperty.reset();
    this.numberLine.reset();
    this.pointControllerBoxProperty.reset();
  }

}

numberLineDistance.register( 'NLDModel', NLDModel );
export default NLDModel;
