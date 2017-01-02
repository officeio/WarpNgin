import { ASTElement } from '../Syntax';
import { ASTChildren, ViewTemplate } from '../Index';

// beforeEach(function () {
//     this.addMatchers({
//         toBeInstanceOf: function (expected) {
//             return this.actual instanceof expected;
//         }
//     });
// });

describe('ViewTemplate', () => {

    describe('fromHtml', () => {

        it('returns ViewTemplate', () => {

            const result = ViewTemplate.fromHtml('<h1></h1>');

            expect(result).toBeTruthy();
            // expect(result).toBeInstanceOf(ViewTemplate);
            expect((<ASTElement>result.templateElement.children[0]).name).toEqual('h1');

        });

    });

    describe('executeToHtml', () => {

        it('without scope or attributes', () => {

            const view = ViewTemplate.fromHtml(`<h1></h1>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1></h1>');

        });

        it('with placeholder, no attributes', () => {

            const view = ViewTemplate.fromHtml(`<h1>@{test}</h1>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1></h1>');

        });

        it('with placeholder, given attribute', () => {

            const view = ViewTemplate.fromHtml(`<h1>@{test}</h1>`);
            const attributes = {
                test: 'test_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>test_value</h1>');

        });

        it('with internal template, no instance element', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"></s:template>`);

            var result = view.executeToHtml();

            expect(result).toEqual('');

        });

        it('with internal template, with empty instance element', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"></s:template>` 
                + `<test-element></test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('');

        });

        it('with internal template, with instance element', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1></h1></s:template>` 
                + `<test-element></test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1></h1>');

        });

        it('with internal template, with instance element, with placeholders', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1>@{test}</h1></s:template>` 
                + `<test-element test="test_value"></test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1>test_value</h1>');

        });

        it('with internal template, with instance element, with external attribute, should not display internal placeholder', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1>@{test}</h1></s:template>` 
                + `<test-element></test-element>`);
            const attributes = {
                test: 'test_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1></h1>');

        });

        it('has inner-template, and instance, with transcluded content', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1><s:content></s:content></h1></s:template>` 
                + `<test-element test="test_value">Welcome Everyone!</test-element>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1>Welcome Everyone!</h1>');

        });

        it('has inner-template, and instance, with transcluded content, with outer placeholders', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1><s:content></s:content></h1></s:template>` 
                + `<test-element inner="inner_value">@{outer}</test-element>`);
            const attributes = {
                outer: 'outer_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>outer_value</h1>');

        });

        it('has inner-template, and instance, with transcluded content, with inner placeholders, should not output placeholder', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1><s:content></s:content></h1></s:template>` 
                + `<test-element inner="inner_value">@{inner}</test-element>`);
            const attributes = {
                outer: 'outer_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1></h1>');

        });

        it('has inner-template, and instance, with pass-thru placeholders, should output placeholder', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:template tag="test-element"><h1>@{inner}</h1></s:template>` 
                + `<test-element inner="@{outer}"></test-element>`);
            const attributes = {
                outer: 'outer_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>outer_value</h1>');

        });

        it('has included template, should be file contents', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:include path="samples/spec1/test-include-1.html"></s:include>`);

            var result = view.executeToHtml();

            expect(result).toEqual('<h1>TestInclude</h1>');

        });

        it('has included template from non-existing file, should error', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:include path="samples/spec1/test-include-not-found.html"></s:include>`);

            expect(function () {

                view.executeToHtml();

            }).toThrow();

        });

        it('has included template, with placeholder, should be file contents with replacement', () => {

            const view = ViewTemplate.fromHtml(`` 
                + `<s:include path="samples/spec1/test-include-2.html"></s:include>`);
            const attributes = {
                test: 'test_value'
            };

            var result = view.executeToHtml(attributes);

            expect(result).toEqual('<h1>test_value</h1>');

        });

        // TODO: One ensiring nested templates honour their relative paths.

    });

});