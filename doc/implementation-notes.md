# Number Line: Distance - Implementation Notes

This document contains notes related to the implementation of the "Number Line: Distance" simulation. The intended
audience is developers who need to make changes to or need to leverage the code. Such a need may arise if new features
are added, or if bugs or usability issues are reported. This document is intended to provide a high level overview.

## Overview

The point of this simulation is to demonstrate concepts of distance through number lines. The simulation is used to
demonstrate both absolute (unsigned) and directed (signed) distances. All scenes/screens in the simulation have only one
number line and exactly two point controllers, which allows for a lot of basic abstractions. The majority of this sim's
base functionality is derived from number-line-common.

Due to the similarity between the majority of the scenes/screens, a large amount of abstraction was able to be leveraged.
For example, the `AbstractNLDBaseModel` class handles the majority of all models' duties. Similarly, `NLDBaseView` is the
workhorse that handles the base layout and common elements in all scenes/screens.

## General Considerations

**Model-View Transform**

As is with all number-line sims, the model and view share the same coordinate system so there is no need for model-view
transforms.

**Memory Management**

Because number-line-distance is mostly static, very few elements are ever added or removed over the lifetime of the
simulation. As such, memory, for the most part, is not a concern. One must be careful with `NumberLinePoint`s being added
and removed. There is no need to dispose anything because everything else is present over the sim's lifetime.

## Terminology

* **Scene/Screen:** The simulation is divided into two _screens_: the explore screen and generic screen. The explore screen
has 3 _scenes_: the distance scene, temperature scene, and elevation scene. The naming convention matches what is used in
number-line-integers, which leads to the unfortunately non-descriptive name of distance scene for the scene that has the
house and person.
  
* **Play Area:** In the explore screen, the point controllers can only interact with the number line when they are in some
specific area. This area is called the play area. Point controllers dragged outside the play area are generally moved
back into the box unless they are able to 'drop' into the play area.
  
* **DropFromDirection:** In the explore screen, point controllers can 'drop' into the play area. The `DropFromDirection`
is the relation for where the point controller must be in relation to the play area in order to be able to drop into it.
For example, a `DropFromDirection` of `LEFT` means that the point controller must be left of the play area in order to
drop into it; a point controller anywhere else is moved into the box. The `DropFromDirection` so far is chosen to
correspond with the relation of the number line to the play area, so a number line above the play area will correspond
with a `DropFromDirection` of `TOP`.

## Key Classes, Responsibilities, and Relationships in the Common Code

### Model

### View

## Explore Screen

### Distance Scene

### Temperature Scene

### Elevation Scene

## Generic Screen
