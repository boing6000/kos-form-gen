# fa-angular-form-gen

Originally forked from angular-form-gen by McNull (https://github.com/McNull)

## Description

Many projects utilize FontAwesome icons as their go-to icon family. This fork of `angular-form-gen` by McNull removes glyphicons and implements font-awesome icons by default. It also removes sourcemaps in the compiled version (which plays nice with browserify), as well as fixing some of the regex issues that the previous had caused when using `ng-pattern`.

> For further details on how to build and use this library, please refer to the original README found in McNull's repo. 

## Added Tasks

### gulp dist-no-test

All this does is just cleans and compiles the codes without test. Useful for quick builds.
