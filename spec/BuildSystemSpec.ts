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

    describe('getTargetFilename', () => {

        it('Should give joined path', () => {

            const system = new BuildSystem();

            const filename = system
                .getTargetFilename('test/page.html', 'dest')
                .replace(/\\/g, '/');

            expect(filename).toEqual('dest/test/page.html');

        });

    });

    describe('build', () => {

        describe('...', () => {

            it('...', () => {

                const project = new Project();
                project.set({ 
                    outDirectory: 'temp',
                    rootDirectory: 'samples/spec1'
                });

                const system = new BuildSystem(project);
                
                system.build();

            });

        });

    });

});