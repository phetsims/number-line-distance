// Copyright 2024, University of Colorado Boulder

/**
 * PointControllerLegendNode serves as a legend and control for swapping which representation is associated
 * with x1 and x2 (or y1 and y2).
 *
 * @author Saurabh Totey
 * @author Chris Malley (PixelZoom, Inc.)
 */

import numberLineDistance from '../../numberLineDistance.js';
import { HBox, HBoxOptions, Node, NodeTranslationOptions, Path, Rectangle, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import NLDConstants from '../NLDConstants.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import { Shape } from '../../../../kite/js/imports.js';
import ArrowShape, { ArrowShapeOptions } from '../../../../scenery-phet/js/ArrowShape.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const TEXT_OPTIONS = {
  font: new MathSymbolFont( 30 ),
  maxWidth: 50
};
const TEXT_SPACING = 8;
const TEXT_ICON_SPACING = 15;

type SelfOptions = EmptySelfOptions;
type PointControllerLegendNodeOptions = SelfOptions & NodeTranslationOptions;

export default class PointControllerLegendNode extends HBox {

  public constructor(
    pointControllerRepresentationOne: Node,
    pointControllerRepresentationTwo: Node,
    isPrimaryControllerSwappedProperty: Property<boolean>,
    orientationProperty: TReadOnlyProperty<Orientation>,
    providedOptions?: PointControllerLegendNodeOptions
  ) {

    const options = optionize<PointControllerLegendNodeOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 20
    }, providedOptions );

    // Add pointControllerRepresentations to rectangles that ensure that the representations take up the same space.
    const largestRepresentationWidth = Math.max( pointControllerRepresentationOne.width, pointControllerRepresentationTwo.width );
    const largestRepresentationHeight = Math.max( pointControllerRepresentationOne.height, pointControllerRepresentationTwo.height );
    const pointControllerRepresentationBackgroundOne = new Rectangle( 0, 0, largestRepresentationWidth, largestRepresentationHeight );
    const pointControllerRepresentationBackgroundTwo = new Rectangle( 0, 0, largestRepresentationWidth, largestRepresentationHeight );
    pointControllerRepresentationOne.center = pointControllerRepresentationBackgroundOne.center;
    pointControllerRepresentationTwo.center = pointControllerRepresentationBackgroundTwo.center;
    pointControllerRepresentationBackgroundOne.addChild( pointControllerRepresentationOne );
    pointControllerRepresentationBackgroundTwo.addChild( pointControllerRepresentationTwo );

    const horizontalVisibleProperty = new DerivedProperty( [ orientationProperty ],
      orientation => orientation === Orientation.HORIZONTAL );
    const verticalVisibleProperty = DerivedProperty.not( horizontalVisibleProperty );

    const firstNodeEqualToText = new Text( MathSymbols.EQUAL_TO, TEXT_OPTIONS );
    const firstNodeHorizontalText = new RichText( NLDConstants.X_1_STRING,
      combineOptions<RichTextOptions>( { visibleProperty: horizontalVisibleProperty }, TEXT_OPTIONS ) );
    const firstNodeVerticalText = new RichText( NLDConstants.Y_1_STRING,
      combineOptions<RichTextOptions>( { visibleProperty: verticalVisibleProperty }, TEXT_OPTIONS ) );
    const firstNodeTextHBox = new HBox( {
      children: [ firstNodeHorizontalText, firstNodeVerticalText, firstNodeEqualToText ],
      spacing: TEXT_SPACING
    } );

    const secondNodeHorizontalText = new RichText( NLDConstants.X_2_STRING,
      combineOptions<RichTextOptions>( { visibleProperty: horizontalVisibleProperty }, TEXT_OPTIONS ) );
    const secondNodeVerticalText = new RichText( NLDConstants.Y_2_STRING,
      combineOptions<RichTextOptions>( { visibleProperty: verticalVisibleProperty }, TEXT_OPTIONS ) );
    const secondNodeEqualToText = new Text( MathSymbols.EQUAL_TO, TEXT_OPTIONS );
    const secondNodeTextHBox = new HBox( {
      children: [ secondNodeHorizontalText, secondNodeVerticalText, secondNodeEqualToText ],
      spacing: TEXT_SPACING
    } );

    const firstNodeHBox = new HBox( {
      children: [ firstNodeTextHBox, pointControllerRepresentationBackgroundOne ],
      spacing: TEXT_ICON_SPACING
    } );
    const secondNodeHBox = new HBox( {
      children: [ secondNodeTextHBox, pointControllerRepresentationBackgroundTwo ],
      spacing: TEXT_ICON_SPACING
    } );
    const nodeOrderDisplay = new VBox( {
      children: [ firstNodeHBox, secondNodeHBox ],
      spacing: ( 40 - firstNodeHBox.height ) / 2
    } );

    // Button that swaps the primary point controller and secondary point controller when pressed.
    // Padding and dilations were determined empirically.
    const swapPrimaryNodesButton = new RectangularPushButton( {
      content: new SwapIcon(),
      baseColor: 'white',
      touchAreaXDilation: 8,
      touchAreaYDilation: 8,
      listener: () => { isPrimaryControllerSwappedProperty.value = !isPrimaryControllerSwappedProperty.value; }
    } );

    options.children = [ nodeOrderDisplay, swapPrimaryNodesButton ];

    super( options );

    // Listen for when the primary node should be swapped, and swap the representations.
    isPrimaryControllerSwappedProperty.link( isPrimaryControllerSwapped => {
      let firstNodeHBoxChildren;
      let secondNodeHBoxChildren;
      if ( isPrimaryControllerSwapped ) {
        firstNodeHBoxChildren = [ firstNodeTextHBox, pointControllerRepresentationBackgroundTwo ];
        secondNodeHBoxChildren = [ secondNodeTextHBox, pointControllerRepresentationBackgroundOne ];
      }
      else {
        firstNodeHBoxChildren = [ firstNodeTextHBox, pointControllerRepresentationBackgroundOne ];
        secondNodeHBoxChildren = [ secondNodeTextHBox, pointControllerRepresentationBackgroundTwo ];
      }
      // Don't have the nodes handled by layout of multiple containers at once
      firstNodeHBoxChildren.forEach( node => node.detach() );
      secondNodeHBoxChildren.forEach( node => node.detach() );
      firstNodeHBox.children = firstNodeHBoxChildren;
      secondNodeHBox.children = secondNodeHBoxChildren;
    } );
  }
}

/**
 * A node that has paths that depict a 'swap' icon which is nearly a half-ellipse with arrows at the end.
 * The half-ellipse is on the right with arrows on the left pointing to the left.
 * All numbers/values used herein were determined empirically.
 */
class SwapIcon extends Node {

  public constructor() {

    const ellipseAngleInset = Math.PI / 12;
    const arrowSize = 5;
    const arrowShapeOptions: ArrowShapeOptions = {
      tailWidth: 0,
      headHeight: arrowSize,
      headWidth: arrowSize
    };
    const arrowXTranslation = 4;
    const arrowYTranslation = 10;

    const pathOptions = {
      stroke: 'black',
      lineWidth: 4
    };

    super( {
      children: [
        new Path(
          new Shape().ellipticalArc( 0, 0, 8, 12, 0,
            -Math.PI / 2 + ellipseAngleInset, Math.PI / 2 - ellipseAngleInset ),
          pathOptions
        ),
        new Path(
          new ArrowShape( 0, 0, -arrowSize, arrowSize, arrowShapeOptions )
            .transformed( Matrix3.translation( arrowXTranslation, arrowYTranslation ) ),
          pathOptions
        ),
        new Path(
          new ArrowShape( 0, 0, -arrowSize, -arrowSize, arrowShapeOptions )
            .transformed( Matrix3.translation( arrowXTranslation, -arrowYTranslation ) ),
          pathOptions
        )
      ]
    } );
  }
}

numberLineDistance.register( 'PointControllerLegendNode', PointControllerLegendNode );