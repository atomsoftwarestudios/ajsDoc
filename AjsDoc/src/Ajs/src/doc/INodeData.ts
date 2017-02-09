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

namespace ajs.doc {

    "use strict";

    /**
     * Node metadata generated by the renderer and stored within the node in the Shadow DOM 
     * <p>
     * These metadata are copied to the target nodes in the target document and are used to identify
     * the DOM component or DOM Node component owner, inform dom updater the Node can be skupped from
     * the DOM update process or inform the DOM updater it has to register event listeners for given
     * events to the target DOM node
     * </p>
     */
    export interface INodeData {
        /** Uniqe object to be assigned to the node (usually ViewComponent) - used to uniquely identify a dom component */
        component: IComponent;
        /**
         * Owner component of the node to which the metadata is added
         * can be used to identify the component when event is fired from the node
         */
        ownerComponent: IComponent;
        /** Indicates the node should be skipped from the update process */
        skipUpdate: boolean;
        /** Indicates the tag has event listeners to be registered or registered already */
        eventListeners?: INodeEventListenerInfo[];
    }

}