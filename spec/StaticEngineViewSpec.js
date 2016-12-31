'use strict';

const StaticEngineView = require('../@StaticEngine').View

beforeEach(function () {
    this.addMatchers({
        toBeInstanceOf: function (expected) {
            return this.actual instanceof expected;
        }
    });
});

describe('StaticEngineView', () => {

    describe('fromHtml', () => {

        it('returns StaticEngineView', () => {

            const result = StaticEngineView.fromHtml('<h1></h1>');

            expect(result).toBeTruthy();
            expect(result).toBeInstanceOf(StaticEngineView);
            expect(result.templateElement.childNodes[0].tagName).toEqual('h1');

        });

    });

    describe('executeToHtml', () => {

        it('without scope or attributes', () => {

            const view = StaticEngineView.fromHtml(`<h1></h1>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1></h1>');

        });

        it('with placeholder, no attributes', () => {

            const view = StaticEngineView.fromHtml(`<h1>{{test}}</h1>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1></h1>');

        });

        it('with placeholder, given attribute', () => {

            const view = StaticEngineView.fromHtml(`<h1>{{test}}</h1>`);
            const attributes = {
                test: 'test_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>test_value</h1>');

        });

        it('with internal template, no instance element', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"></s:template>`);

            var result = view.executeToHtml();

            expect(result).toEqual('');

        });

        it('with internal template, with empty instance element', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"></s:template>` 
                + `<test-element></test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('');

        });

        it('with internal template, with instance element', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1></h1></s:template>` 
                + `<test-element></test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1></h1>');

        });

        it('with internal template, with instance element, with placeholders', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1>{{test}}</h1></s:template>` 
                + `<test-element test="test_value"></test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1>test_value</h1>');

        });

        it('with internal template, with instance element, with external attribute, should not display internal placeholder', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1>{{test}}</h1></s:template>` 
                + `<test-element></test-element>`);
            const attributes = {
                test: 'test_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1></h1>');

        });

        it('has inner-template, and instance, with transcluded content', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1><s:content></s:content></h1></s:template>` 
                + `<test-element test="test_value">Welcome Everyone!</test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1>Welcome Everyone!</h1>');

        });

        it('has inner-template, and instance, with transcluded content, with outer placeholders', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1><s:content></s:content></h1></s:template>` 
                + `<test-element inner="inner_value">{{outer}}</test-element>`);
            const attributes = {
                outer: 'outer_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>outer_value</h1>');

        });

        it('has inner-template, and instance, with transcluded content, with inner placeholders, should not output placeholder', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1><s:content></s:content></h1></s:template>` 
                + `<test-element inner="inner_value">{{inner}}</test-element>`);
            const attributes = {
                outer: 'outer_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1></h1>');

        });

        it('has inner-template, and instance, with pass-thru placeholders, should output placeholder', () => {

            const view = StaticEngineView.fromHtml(`` 
                + `<s:template tag="test-element"><h1>{{inner}}</h1></s:template>` 
                + `<test-element inner="{{outer}}"></test-element>`);
            const attributes = {
                outer: 'outer_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>outer_value</h1>');

        });

    });

});