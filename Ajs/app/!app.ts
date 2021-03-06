/* *************************************************************************
The MIT License (MIT)
Copyright (c)2016-2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

// TypeDoc testing

namespace ajs.app {

    "use strict";

    // following declarations / definitions are here to make sure the typedoc & ajsdoc browser works well

    /**
     * this is signature 1
     * @param test
     */
    export function test(test: string): string;

    /**
     * this is signature 2
     * @param test
     */
    export function test(test: number): number;

    /**
     * @param test
     */
    export function test(test: number): Date;

    /**
     * this is signature 4
     * @param test
     */
    export function test(test: any): any {
        return null;
    }

    /**
     * this is test1 signature
     * @param x rrr
     */
    export function test1(x?: string | number | Object): any {
        return null;
    }

    /**
     * this is test2 function
     */
    function test2(): number {
        return 0;
    }

    /**
     * this is test3 function
     */
    function test3(test: string): string {
        return "";
    }

    /**
     * This is interface 1
     */
    interface Interface1 {
        (index: number): string[];
    }

    /**
     * This is interface 2
     */
    interface Interface2 {
        /** This is name */
        name: string;
        /** This is zip */
        zip: number;
    }

    /**
     * This is interface 3
     */
    interface Interface3 {
        [index: number]: string;
    }

    /**
     * This is interface 3
     */
    interface Interface4 extends Interface2, Interface3 {
    }

    /**
     * This is class 1
     */
    class Class1 {
    }

    /**
     * This is class 2
     */
    class Class2 extends Class1 {
    }

    /**
     * This is class 3
     */
    class Class3 extends Class2 implements Interface2 {

        /** This is name at class */
        public name: string;
        /** This is zip at class */
        public zip: number;

    }

    /**
     * This is class 4
     */
    class Class4 extends Class3 {
    }

}
