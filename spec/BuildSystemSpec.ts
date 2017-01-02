import { BuildSystem, Project } from '../Index';

describe('BuildSystem', () => {

    describe('buildPageFile', () => {

        // describe('With Non-Existing File', () => {

        //     it("Should Error", () => {

        //         const system = new BuildSystem();

        //         expect(function() {

        //             system.buildPageFile('spec/test-not-existing-file');
                    
        //         }).toThrow();

        //     });

        // });

    });

    describe('build', () => {

        describe('Build Spec1 Sample', () => {

            it('Should Not Error', () => {

                const project = new Project();
                project.set({ 
                    outDirectory: 'temp',
                    rootDirectory: 'samples/spec1'
                });

                const system = new BuildSystem(project);
                
                system.build();

            });

        });

        describe('Build Spec2 Sample', () => {

            it('Should Not Error', () => {

                const project = new Project();
                project.set({ 
                    outDirectory: 'temp',
                    rootDirectory: 'samples/spec2'
                });

                const system = new BuildSystem(project);
                
                system.build();

            });

        });

    });

});