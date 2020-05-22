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

const BOTTOM_BOX_WIDTH = 320;
const BOTTOM_BOX_HEIGHT = 70;
const INSET = 30;
const BOTTOM_BOX_BOUNDS = new Bounds2(
  NLDConstants.NLD_LAYOUT_BOUNDS.centerX - BOTTOM_BOX_WIDTH / 2,
  NLDConstants.NLD_LAYOUT_BOUNDS.maxY - BOTTOM_BOX_HEIGHT - INSET,
  NLDConstants.NLD_LAYOUT_BOUNDS.centerX + BOTTOM_BOX_WIDTH / 2,
  NLDConstants.NLD_LAYOUT_BOUNDS.maxY - INSET
);

class NLDModel {

  /**
   * @param {Tandem} tandem
   * @param {SpatializedNumberLine} numberLine
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

    // @public {SpatializedNumberLine}
    this.numberLine = numberLine;

    // @public {Property<Bounds2>} the bounds of the toolbox that point controllers return to; can change with numberline orientation
    this.pointControllerBoxProperty = new Property( BOTTOM_BOX_BOUNDS, { valueType: Bounds2 } );
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
