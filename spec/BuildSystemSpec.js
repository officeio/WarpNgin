'use strict';

const BuildSystem = require('../@StaticEngine').Build;

describe('BuildSystem', () => {

    describe('BuildSingleFile', () => {

        describe('With Non-Existing File', () => {

            it("Should Error", () => {

                const system = new BuildSystem();

                expect(function() {

                    system.BuildSingleFile('spec/test-not-existing-file');
                    
                }).toThrow();

            });

        });

    });

});