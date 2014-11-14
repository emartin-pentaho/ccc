define([
    'ccc/cgf',
    'ccc/def',
    'test/utils'
], function(cgf, def, utils) {

    /*global describe:true, it:true, expect:true, spyOn: true, beforeEach:true, afterEach:true  */

    // TODO: not testing the spawning of single scene (ValueTemplate children),
    // possibly null, and properties with and without factory.

    var When   = utils.describeTerm("when"),
        With   = utils.describeTerm("with"),
        The    = utils.describeTerm("the"),
        Should = utils.itTerm("should");

    describe("cgf.dom.Template - #spawn -", function() {

        When("spawning a template hierarchy", function() {
            With("a single root scene, with a default `scenes`", function() {
                var templA = new cgf.dom.EntityTemplate()
                    .add(cgf.dom.EntityTemplate)
                    .parent
                    .add(cgf.dom.EntityTemplate)
                    .parent,

                    templB = templA.content()[0],
                    templC = templA.content()[1];

                expect(templB != null).toBe(true);
                expect(templC != null).toBe(true);

                var scene = {};

                The("spawned element hierarchy", function() {
                    Should("have the structure of the template", function() {
                        var elemA = templA.spawn(scene);
                        expect(elemA instanceof templA.Element).toBe(true);
                        expect(elemA.content.length).toBe(2);

                        var elemB = elemA.content[0];
                        expect(elemB instanceof templB.Element).toBe(true);
                        expect(!elemB.content).toBe(true);

                        var elemC = elemA.content[1];
                        expect(elemC instanceof templC.Element).toBe(true);
                        expect(!elemC.content).toBe(true);
                    });

                    Should("generate elements with the same scene", function() {
                        var elemA = templA.spawn(scene);

                        var elemB = elemA.content[0];
                        expect(elemB.scene).toBe(scene);

                        var elemC = elemA.content[1];
                        expect(elemC.scene).toBe(scene);
                    });

                    Should("generate elements with index 0", function() {
                        var elemA = templA.spawn(scene);

                        var elemB = elemA.content[0];
                        expect(elemB.index).toBe(0);

                        var elemC = elemA.content[1];
                        expect(elemC.index).toBe(0);
                    });
                });
            });

            With("a single root scene, with a custom `scenes` of 1 entry", function() {
                var templA = new cgf.dom.EntityTemplate()
                        .scenes(function(s) { return [s]; })
                        .add(cgf.dom.EntityTemplate)
                        .scenes(function(s) { return [s]; })
                        .parent
                        .add(cgf.dom.EntityTemplate)
                        .scenes(function(s) { return [s]; })
                        .parent,

                    templB = templA.content()[0],
                    templC = templA.content()[1];

                expect(templB != null).toBe(true);
                expect(templC != null).toBe(true);

                var scene = {};

                The("spawned element hierarchy", function() {
                    Should("have the structure of the template", function() {
                        var elems = templA.spawn(scene);
                        expect(def.array.is(elems)).toBe(true);
                        expect(elems.length).toBe(1);

                        var elemA = elems[0];
                        expect(elemA instanceof templA.Element).toBe(true);
                        expect(elemA.content.length).toBe(2);

                        var elemsB = elemA.content[0];
                        expect(elemsB.length).toBe(1);
                        expect(elemsB[0] instanceof templB.Element).toBe(true);
                        expect(!elemsB[0].content).toBe(true);

                        var elemsC = elemA.content[1];
                        expect(elemsC.length).toBe(1);
                        expect(elemsC[0] instanceof templC.Element).toBe(true);
                        expect(!elemsC[0].content).toBe(true);
                    });

                    Should("generate elements with the same scene", function() {
                        var elems = templA.spawn(scene);

                        var elemA = elems[0];
                        expect(elemA.scene).toBe(scene);

                        var elemsB = elemA.content[0];
                        expect(elemsB.length).toBe(1);
                        expect(elemsB[0].scene).toBe(scene);

                        var elemsC = elemA.content[1];
                        expect(elemsC.length).toBe(1);
                        expect(elemsC[0].scene).toBe(scene);
                    });

                    Should("generate elements with index 0", function() {
                        var elems = templA.spawn(scene);

                        var elemA = elems[0];
                        expect(elemA.index).toBe(0);

                        var elemsB = elemA.content[0];
                        expect(elemsB[0].index).toBe(0);

                        var elemsC = elemA.content[1];
                        expect(elemsC[0].index).toBe(0);
                    });
                });
            });

            With("two root scenes, returned by root-template#scenes", function() {
                var sceneA = {},
                    sceneB = {},
                    scene0 = {children: [sceneA, sceneB]},

                    templA = new cgf.dom.EntityTemplate()
                        .scenes(function(scene) { return scene.children; })
                        .add(cgf.dom.EntityTemplate)
                        .parent
                        .add(cgf.dom.EntityTemplate)
                        .parent,

                    templB = templA.content()[0],
                    templC = templA.content()[1];

                expect(templB != null).toBe(true);
                expect(templC != null).toBe(true);

                function testElementHierachyStructure(elemA) {
                    expect(elemA instanceof templA.Element).toBe(true);
                    expect(elemA.content.length).toBe(2);

                    var elemB = elemA.content[0];
                    expect(elemB instanceof templB.Element).toBe(true);
                    expect(!elemB.content).toBe(true);

                    var elemC = elemA.content[1];
                    expect(elemC instanceof templC.Element).toBe(true);
                    expect(!elemC.content).toBe(true);
                }

                function testElementHierachyScene(elemA, scene) {
                    expect(elemA.scene).toBe(scene);

                    var elemB = elemA.content[0];
                    expect(elemB.scene).toBe(scene);

                    var elemC = elemA.content[1];
                    expect(elemC.scene).toBe(scene);
                }

                function testElementHierachyIndex(elemA, index) {
                    expect(elemA.index).toBe(index);

                    var elemB = elemA.content[0];
                    expect(elemB.index).toBe(0);

                    var elemC = elemA.content[1];
                    expect(elemC.index).toBe(0);
                }

                The("two spawned element hierarchies", function() {
                    Should("have the structure of the template", function() {
                        var elems = templA.spawn(scene0);

                        expect(def.array.is(elems)).toBe(true);
                        expect(elems.length).toBe(2);

                        testElementHierachyStructure(elems[0]);
                        testElementHierachyStructure(elems[1]);
                    });

                    Should("generate elements with the same scene", function() {
                        var elems = templA.spawn(scene0);

                        testElementHierachyScene(elems[0], sceneA);
                        testElementHierachyScene(elems[1], sceneB);
                    });

                    Should("generate elements with index 0", function() {
                        var elems = templA.spawn(scene0);

                        testElementHierachyIndex(elems[0], 0);
                        testElementHierachyIndex(elems[1], 1);
                    });
                });
            });

            Should("only create child Elements for applicable parent Elements", function() {
                var sceneA = {x: 1},
                    sceneB = {x: 2},
                    scene0 = {children: [sceneA, sceneB]},

                    templA = new cgf.dom.EntityTemplate()
                        .scenes(function(scene) { return scene.children; })
                        .add(cgf.dom.EntityTemplate) // B
                        .applicable(function(scene) { return scene.x > 1; })
                        .add(cgf.dom.EntityTemplate) // C
                        .parent
                        .parent,

                    templB = templA.content()[0],
                    templC = templB.content()[0];

                expect(templB != null).toBe(true);
                expect(templC != null).toBe(true);

                // ------------

                var elems = templA.spawn(scene0);
                expect(elems.length).toBe(2);

                var elemA = elems[0],
                    elemB = elemA.content[0];

                expect(elemB instanceof templB.Element).toBe(true);
                expect(elemB.content[0] instanceof templC.Element).toBe(true);

                elemA = elems[1];

                elemB = elemA.content[0];
                expect(elemB instanceof templB.Element).toBe(true);

                var elemC = elemB.content[0];
                expect(elemC instanceof templC.Element).toBe(true);
            });
        });

        When("a child template has a `scenes` that returns more than one scene", function() {
            var templRoot = new cgf.dom.EntityTemplate();

            var templChild = templRoot.add(cgf.dom.EntityTemplate)
                .scenes(function(ps) { return ps.children; });

            var sceneA = {}, sceneB = {},
                parentScene = {children: [sceneA, sceneB]};

            Should("result in a child group array with one element per scene", function() {
                var elemRoot = templRoot.spawn(parentScene);
                expect(elemRoot instanceof templRoot.Element).toBe(true);
                expect(elemRoot.content.length).toBe(1);

                var elemsChild = elemRoot.content[0];
                expect(elemsChild instanceof Array).toBe(true);
                expect(elemsChild.length).toBe(2);

                expect(elemsChild[0] instanceof templChild.Element).toBe(true);
                expect(elemsChild[1] instanceof templChild.Element).toBe(true);
                expect(!elemsChild[0].content).toBe(true);
                expect(!elemsChild[1].content).toBe(true);
            });
        });

        When("a child template has a `scenes` property that returns an array with a single scene", function() {
            var templRoot = new cgf.dom.EntityTemplate();

            var templChild = templRoot.add(cgf.dom.EntityTemplate)
                .scenes(function(ps) { return [ps]; });

            var parentScene = {};

            Should("in a child group array with one element", function() {
                var elemRoot = templRoot.spawn(parentScene);
                expect(elemRoot instanceof templRoot.Element).toBe(true);
                expect(elemRoot.content.length).toBe(1);

                var elemsChild = elemRoot.content[0];
                expect(elemsChild instanceof Array).toBe(true);
                expect(elemsChild.length).toBe(1);

                expect(elemsChild[0] instanceof templChild.Element).toBe(true);
                expect(!elemsChild[0].content).toBe(true);
            });
        });

        When("a child template has a `scenes` property that returns one scene object", function() {
            var templRoot = new cgf.dom.EntityTemplate();

            var templChild = templRoot.add(cgf.dom.EntityTemplate)
                .scenes(function(ps) { return ps; }); // <-- NOTE: not an array!

            var parentScene = {};

            Should("result in a non-array child group: the single child element", function() {
                var elemRoot = templRoot.spawn(parentScene);
                expect(elemRoot instanceof templRoot.Element).toBe(true);
                expect(elemRoot.content.length).toBe(1);

                var elemsChild = elemRoot.content[0];
                expect(elemsChild instanceof templChild.Element).toBe(true);
                expect(!elemsChild.content).toBe(true);
            });
        });

        describe("re-spawn -", function() {
            var templRoot, templChild, elemRoot, elemChild1,
                parentScene, sceneA = {}, sceneB = {};

            beforeEach(function() {
                templRoot = new cgf.dom.EntityTemplate();
            });

            When("1st: spawns 0 elements,", function() {
                beforeEach(function() {
                    templChild = templRoot.add(cgf.dom.EntityTemplate)
                        .scenes(function(ps) { return ps.children; });

                    parentScene = {children: []};

                    elemRoot = templRoot.spawn(parentScene);
                });

                When("2nd: spawns 0 elements,", function() {

                    beforeEach(function() {
                        elemChild1 = elemRoot.content[0];

                        elemRoot.invalidate();
                    });

                    Should("keep the childGroup empty", function() {
                        expect(elemChild1).toEqual([]);

                        expect(elemRoot.content[0]).toBe(elemChild1);
                    });
                });

                When("2nd: spawns a single element,", function() {
                    var elemChild0;

                    beforeEach(function() {
                        elemChild0 = elemRoot.content[0];

                        parentScene.children.push(sceneA);

                        elemRoot.invalidate();

                        elemChild1 = elemRoot.content[0];
                    });

                    Should("spawn the same array with a single element", function() {
                        expect(elemChild0 instanceof Array).toBe(true);
                        expect(elemChild0).toBe(elemChild1);
                        expect(elemChild1.length).toBe(1);
                        expect(elemChild1[0] instanceof cgf.dom.Element).toBe(true);
                    });

                    Should("spawn an element with the correct scene", function() {
                        expect(elemChild1[0].scene).toBe(sceneA);
                    });
                });

                When("2nd: spawns two elements,", function() {
                    var childGroup0, childGroup1;

                    beforeEach(function() {
                        childGroup0 = elemRoot.content[0];

                        parentScene.children.push(sceneA, sceneB);

                        elemRoot.invalidate();

                        childGroup1 = elemRoot.content[0];
                    });

                    Should("make the childGroup be the same array with two positions", function() {
                        expect(def.array.is(childGroup0)).toBe(true);
                        expect(childGroup1).toBe(childGroup1);

                        expect(childGroup1.length).toBe(2);
                    });

                    Should("spawn a 1st element", function() {
                        expect(childGroup1[0] instanceof cgf.dom.Element).toBe(true);
                    });

                    Should("spawn a 2nd element", function() {
                        expect(childGroup1[1] instanceof cgf.dom.Element).toBe(true);
                    });

                    Should("spawn the 1st element with the 1st scene", function() {
                        expect(childGroup1[0].scene).toBe(sceneA);
                    });

                    Should("spawn the 2nd element with the 2nd scene", function() {
                        expect(childGroup1[1].scene).toBe(sceneB);
                    });
                });
            });

            When("1st: spawns a single element,", function() {
                beforeEach(function() {
                    templChild = templRoot.add(cgf.dom.EntityTemplate)
                        .scenes(function(ps) { return ps.children; });

                    parentScene = {children: sceneA};

                    elemRoot = templRoot.spawn(parentScene);
                });

                When("2nd: spawns a single element,", function() {
                    Should("spawn the same element", function() {
                        elemChild1 = elemRoot.content[0];

                        expect(elemChild1 instanceof cgf.dom.Element).toBe(true);

                        elemRoot.invalidate();

                        var elemChild2 = elemRoot.content[0];

                        expect(elemChild1).toBe(elemChild2);
                    });

                    Should("update the version on the single element", function() {
                        elemChild1 = elemRoot.content[0];

                        var va = elemChild1._versionAttributes,
                            ve = elemChild1._versionEntities;

                        elemRoot.invalidate();

                        elemRoot.content;

                        expect(elemChild1._versionAttributes).toBeGreaterThan(va);
                        expect(elemChild1._versionEntities  ).toBeGreaterThan(ve);
                    });
                });

                When("2nd: spawns no elements,", function() {
                    // NOTE: Strictly speaking, this is invalid for a scenes function.
                    // If it returns a single element,
                    // it must always return the same element.

                    beforeEach(function() {
                        elemChild1 = elemRoot.content[0];
                        parentScene.children = null;

                        spyOn(elemChild1, 'dispose');

                        elemRoot.invalidate();
                    });

                    Should("throw an error", function() {
                        expect(function() {
                            elemRoot.content;
                        }).toThrow();
                    });
                });
            });

            When("1st: spawns a single element array,", function() {
                var childGroup0, childGroup1, elemChild0;

                beforeEach(function() {
                    templChild = templRoot.add(cgf.dom.EntityTemplate)
                        .scenes(function(ps) { return ps.children; });

                    parentScene = {children: [sceneA]};

                    elemRoot = templRoot.spawn(parentScene);
                });

                When("2nd: spawns a single element array,", function() {
                    Should("spawn the same array, with the same element", function() {
                        childGroup0 = elemRoot.content[0];
                        elemChild0 = childGroup0[0];

                        expect(elemChild0 instanceof cgf.dom.Element).toBe(true);

                        elemRoot.invalidate();

                        childGroup1 = elemRoot.content[0];

                        expect(childGroup1).toBe(childGroup0);

                        expect(childGroup1[0]).toBe(elemChild0);
                    });

                    Should("update the version of the single element", function() {
                        childGroup0 = elemRoot.content[0];
                        elemChild0 = childGroup0[0];

                        var va = elemChild0._versionAttributes,
                            ve = elemChild0._versionEntities;

                        elemRoot.invalidate();

                        elemRoot.content;

                        expect(elemChild0._versionAttributes).toBeGreaterThan(va);
                        expect(elemChild0._versionEntities  ).toBeGreaterThan(ve);
                    });
                });

                When("2nd: spawns two elements,", function() {
                    var va0, ve0;

                    beforeEach(function() {
                        childGroup0 = elemRoot.content[0];

                        parentScene.children.push(sceneB);

                        elemChild0 = childGroup0[0];
                        va0 = elemChild0._versionAttributes;
                        ve0 = elemChild0._versionEntities;

                        elemRoot.invalidate();

                        childGroup1 = elemRoot.content[0];
                    });

                    Should("make the childGroup the same array, but with two positions", function() {
                        expect(def.array.is(childGroup0)).toBe(true);
                        expect(childGroup1).toBe(childGroup0);
                        expect(childGroup1.length).toBe(2);
                    });

                    Should("spawn the same 1st element", function() {
                        expect(childGroup1[0]).toBe(elemChild0);
                    });

                    Should("spawn the same 1st element with the same scene", function() {
                        expect(elemChild0.scene).toBe(sceneA);
                    });

                    Should("spawn an additional different element", function() {
                        elemChild1 = childGroup1[1];

                        expect(elemChild1).not.toBe(elemChild0);

                        expect(elemChild1 instanceof cgf.dom.Element).toBe(true);
                    });

                    Should("spawn an additional element with the second scene", function() {
                        elemChild1 = childGroup1[1];

                        expect(elemChild1.scene).toBe(sceneB);
                    });

                    Should("update the version of the 1st element", function() {
                        expect(elemChild0._versionAttributes).toBeGreaterThan(va0);
                        expect(elemChild0._versionEntities).toBeGreaterThan(ve0);
                    });
                });

                When("2nd: spawns 0 elements,", function() {

                    beforeEach(function() {
                        childGroup0 = elemRoot.content[0];
                        elemChild0 = childGroup0[0];

                        spyOn(elemChild0, 'dispose');

                        parentScene.children.length = 0;
                        elemRoot.invalidate();
                        elemRoot.content;
                    });

                    Should("make the childGroup be the same array, but empty", function() {
                        expect(elemRoot.content[0]).toBe(childGroup0);
                        expect(childGroup0.length).toBe(0);
                    });

                    Should("call dispose once on the existing element", function() {
                        expect(elemChild0.dispose.calls.length).toBe(1);
                    });
                });

                When("2nd: spawns null elements,", function() {

                    beforeEach(function() {
                        childGroup0 = elemRoot.content[0];
                        elemChild0 = childGroup0[0];

                        parentScene.children = null;
                        elemRoot.invalidate();
                    });

                    Should("throw an error", function() {
                        expect(function() {
                            elemRoot.content;
                        }).toThrow();
                    });
                });
            });

            When("1st: spawns two elements,", function() {
                var childGroup, elemChild0, elemChild1, va0, ve0, va1, ve1;

                beforeEach(function() {
                    templChild = templRoot.add(cgf.dom.EntityTemplate)
                        .scenes(function(ps) { return ps.children; });

                    parentScene = {children: [sceneA, sceneB]};

                    elemRoot = templRoot.spawn(parentScene);

                    childGroup = elemRoot.content[0];

                    elemChild0 = childGroup[0];
                    elemChild1 = childGroup[1];
                });

                When("2nd: spawns two elements,", function() {
                    beforeEach(function() {
                        va0 = elemChild0._versionAttributes;
                        ve0 = elemChild0._versionEntities;

                        va1 = elemChild1._versionAttributes;
                        ve1 = elemChild1._versionEntities;

                        elemRoot.invalidate();
                        elemRoot.content;
                    });

                    Should("maintain the same childGroup array, with two positions", function() {
                        expect(elemRoot.content[0]).toBe(childGroup);
                        expect(childGroup.length).toBe(2);
                    });

                    Should("maintain the 1st element", function() {
                        expect(childGroup[0]).toBe(elemChild0);
                    });

                    Should("maintain the 1st element's scene", function() {
                        expect(elemChild0.scene).toBe(sceneA);
                    });

                    Should("maintain the 2nd element", function() {
                        expect(childGroup[1]).toBe(elemChild1);
                    });

                    Should("maintain the 2nd element's scene", function() {
                        expect(elemChild1.scene).toBe(sceneB);
                    });

                    Should("update version of the 1st element", function() {
                        expect(elemChild0._versionAttributes).toBeGreaterThan(va0);
                        expect(elemChild0._versionEntities).toBeGreaterThan(ve0);
                    });

                    Should("update version of the 2nd element", function() {
                        expect(elemChild1._versionAttributes).toBeGreaterThan(va1);
                        expect(elemChild1._versionEntities).toBeGreaterThan(ve1);
                    });
                });

                When("2nd: spawns three elements,", function() {
                    var sceneC = {};

                    beforeEach(function() {
                        va0 = elemChild0._versionAttributes;
                        ve0 = elemChild0._versionEntities;

                        va1 = elemChild1._versionAttributes;
                        ve1 = elemChild1._versionEntities;

                        parentScene.children.push(sceneC);

                        elemRoot.invalidate();
                        elemRoot.content;
                    });

                    Should("maintain the same childGroup array, with three positions", function() {
                        expect(elemRoot.content[0]).toBe(childGroup);
                        expect(childGroup.length).toBe(3);
                    });

                    Should("maintain the 1st element", function() {
                        expect(childGroup[0]).toBe(elemChild0);
                    });

                    Should("maintain the 1st element's scene", function() {
                        expect(elemChild0.scene).toBe(sceneA);
                    });

                    Should("maintain the 2nd element", function() {
                        expect(childGroup[1]).toBe(elemChild1);
                    });

                    Should("maintain the 2nd element's scene", function() {
                        expect(elemChild1.scene).toBe(sceneB);
                    });

                    Should("update version of the 1st element", function() {
                        expect(elemChild0._versionAttributes).toBeGreaterThan(va0);
                        expect(elemChild0._versionEntities).toBeGreaterThan(ve0);
                    });

                    Should("update version of the 2nd element", function() {
                        expect(elemChild1._versionAttributes).toBeGreaterThan(va1);
                        expect(elemChild1._versionEntities).toBeGreaterThan(ve1);
                    });

                    Should("add an additional different element", function() {
                        var elemChild2 = childGroup[2];
                        expect(elemChild2 instanceof cgf.dom.Element).toBe(true);

                        expect(elemChild2).not.toBe(elemChild1);
                        expect(elemChild2).not.toBe(elemChild0);
                    });

                    Should("add an additional element with the new scene", function() {
                        var elemChild2 = childGroup[2];
                        expect(elemChild2.scene).toBe(sceneC);
                    });
                });

                When("2nd: spawns a single element,", function() {
                    beforeEach(function() {
                        va0 = elemChild0._versionAttributes;
                        ve0 = elemChild0._versionEntities;

                        spyOn(elemChild1, 'dispose');

                        parentScene.children.pop();

                        elemRoot.invalidate();
                        elemRoot.content;
                    });

                    Should("make the childGroup be the same array, but with the 1st element only", function() {
                        expect(elemRoot.content[0]).toBe(childGroup);
                        expect(childGroup.length).toBe(1);
                        expect(childGroup[0]).toBe(elemChild0);
                    });

                    Should("call #refresh once on the 1st element", function() {
                        expect(elemChild0._versionAttributes).toBeGreaterThan(va0);
                        expect(elemChild0._versionEntities).toBeGreaterThan(ve0);
                    });

                    Should("call #dispose once on the 2nd element", function() {
                        expect(elemChild1.dispose).toHaveBeenCalled();
                        expect(elemChild1.dispose.calls.length).toBe(1);
                    });
                });

                When("2nd: spawns no elements,", function() {

                    beforeEach(function() {
                        spyOn(elemChild0, 'dispose');
                        spyOn(elemChild1, 'dispose');

                        parentScene.children.length = 0;

                        elemRoot.invalidate();
                        elemRoot.content;
                    });

                    Should("make the childGroup be the same array, but empty", function() {
                        expect(elemRoot.content[0]).toBe(childGroup);
                        expect(childGroup.length).toBe(0);
                    });

                    Should("call #dispose once on the 1st element", function() {
                        expect(elemChild0.dispose).toHaveBeenCalled();
                        expect(elemChild0.dispose.calls.length).toBe(1);
                    });

                    Should("call #dispose once on the 2nd element", function() {
                        expect(elemChild1.dispose).toHaveBeenCalled();
                        expect(elemChild1.dispose.calls.length).toBe(1);
                    });
                });
            });
        });
    });
});