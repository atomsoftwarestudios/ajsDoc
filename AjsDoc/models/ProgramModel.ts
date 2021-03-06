/* *************************************************************************
The MIT License (MIT)
Copyright (c)2017 Atom Software Studios. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
**************************************************************************** */

namespace ajsdoc {

    "use strict";

    interface IKindMap {
        [key: string]: string;
    }

    const KIND_MAP: IKindMap = {
        Module: "Modules",
        Class: "Classes",
        Interface: "Interfaces",
        Function: "Functions",
        Property: "Properties",
        Method: "Methods",
        Accessor: "Accessors",
        Variable: "Variables",
        Enumeration: "Enumerations",
        Object_literal: "Object literals",
        Constructor: "Constructor"
    };

    const MENU_DONT_EXPAND: string[] = [
        "Interface",
        "Variable",
        "Enumeration",
        "Object literal",
        "Function",
        "Constructor",
        "Method",
        "Property",
        "Accessor"
    ];

    export interface IItemsById {
        [index: number]: INode;
    }

    export interface IProgramDataReadyData {
        menuState?: IMenuState;
        navBarState: INavBarItemsState;
        articleState?: INode;
    }

    export class ProgramModel extends ajs.mvvm.model.Model {

        protected _jsonData: string;
        protected _data: INode;
        protected _itemsById: IItemsById;

        public getMenu(path: string): void {
            this._checkInitialized(
                new Error("Program data loading timeout"),
                () => { this._getMenu(path); }
            );
        }

        public getNavBar(path: string): void {
            this._checkInitialized(
                new Error("Program data loading timeout"),
                () => { this._getNavBar(path); }
            );
        }

        public getContent(path: string): void {
            this._checkInitialized(
                new Error("Program data loading timeout"),
                () => { this._getContent(path); }
            );
        }

        protected _initialize(): void {

            let res: Promise<ajs.resources.IResource> = ajs.Framework.resourceManager.getResource(
                config.dataSources.program,
                config.storageType,
                ajs.resources.CACHE_POLICY.PERMANENT,
                ajs.resources.LOADING_PREFERENCE.CACHE
            );

            res.then(
                (resource: ajs.resources.IResource) => {

                    // parse loaded data and prepare internal structures
                    this._itemsById = {};
                    this._jsonData = resource.data;
                    this._data = JSON.parse(this._jsonData);
                    this._data.kindString = "";
                    this._data.name = "";
                    this._data.comment = { shortText: "<span></span>" };
                    this._data.kind = -1;

                    this._prepareData(this._data, null);

                    this._initialized = true;
                }
            ).catch(
                (reason: any) => {
                    throw new Error("Unable to load program data");
                }
            );
        }

        // anotate the data with additional information
        protected _prepareData(node: INode, parent: INode): void {

            node.parent = parent;
            if (node.id !== undefined) {
                this._itemsById[node.id] = node;
            }

            if (parent && parent !== null) {
                if (node.parent && node.parent.path) {
                    node.path = parent.path;
                }
                node.path = node.path && node.name ? node.path += "/" + node.name : node.path = "/" + node.name;

            } else {
                if (node !== this._data && node.name) {
                    node.path = "/" + node.name;
                } else {
                    node.path = "";
                }
            }

            if (node.children) {
                for (let i: number = 0; i < node.children.length; i++) {
                    this._prepareData(node.children[i], node);
                }
            }
        }

        protected _getMenu(navPath: string): void {

            let node: INode = this.navigate(navPath, true);
            if (!(node.children instanceof Array) || node.children.length === 0) {
                node = node.parent;
            }

            let parentLabel: string = node.parent !== null && node.parent.kind !== 0 ?
                node.parent.kindString + " " + node.parent.name : null;

            let parentPath: string;
            if (node.parent !== null) {
                if (node.parent === this._data) {
                    parentPath = "";
                } else {
                    parentPath = "/ref" + node.parent.path;
                }
            } else {
                parentPath = "";
            }

            let label: string = node.parent && node.parent.kind !== 0 ? node.parent.kindString + " " + node.parent.name : null;

            let menu: IMenuState = {
                parentLabel: parentLabel,
                parentPath: parentPath,
                label: label,
                groups: [],
                items: []
            };

            if (node.parent.kind !== -1) {
                menu.items.push({
                    key: "/ref" + node.path,
                    path: "/ref" + node.path,
                    label: node.kindString + " " + node.name,
                    selected: node.path === ("/" + navPath),
                    expandable: false
                });
            }

            if (node.children) {

                for (let i: number = 0; i < node.children.length; i++) {

                    let kindMapped: string = "Unknown [" + node.children[i].kindString + "]";
                    if (KIND_MAP.hasOwnProperty(node.children[i].kindString.replace(" ", "_"))) {
                        kindMapped = KIND_MAP[node.children[i].kindString.replace(" ", "_")];
                    }

                    let isFromLibDTs: boolean = false;
                    // ignore everyithing from lib.d.ts
                    if (node.children[i].sources instanceof Array) {
                        for (let j: number = 0; j < node.children[i].sources.length; j++) {
                            if (node.children[i].sources[j].fileName.indexOf("lib.d.ts") !== -1) {
                                isFromLibDTs = true;
                                break;
                            }
                        }
                    }


                    let itemGroupIndex: number = this._getGroupIndex(menu, kindMapped);
                    if (itemGroupIndex === -1 && !isFromLibDTs) {

                        menu.groups.push({
                            key: kindMapped + node.children[i].id,
                            label: kindMapped,
                            items: []
                        });
                        itemGroupIndex = menu.groups.length - 1;
                    }

                    if (this._includeInMenu(node.children[i].kindString) && !isFromLibDTs) {
                        menu.groups[itemGroupIndex].items.push({
                            key: node.children[i].id.toString(),
                            path: "/ref" + node.children[i].path,
                            label: node.children[i].name,
                            selected: node.children[i].path === ("/" + navPath),
                            expandable: node.children[i].children instanceof Array &&
                                node.children[i].children.length > 0 &&
                                MENU_DONT_EXPAND.indexOf(node.children[i].kindString) === -1
                        });
                    }
                }

            }

            this._dataReadyNotifier.notify(this, { menuState: menu });
        }

        protected _getNavBar(path: string): void {
            let items: INavBarItemsState = [];

            let node: INode = this.navigate(path);

            let key: number = 0;
            while (node !== null) {
                let navBarItem: INavBarItemState = {
                    key: key.toString(),
                    firstItem: false,
                    itemPath: "/ref" + node.path,
                    itemType: node.kindString,
                    itemLabel: node.name
                };
                if (node.kind !== -1) {
                    items.unshift(navBarItem);
                    key++;
                }
                node = node.parent;
            }

            if (items.length > 0) {
                items[0].firstItem = true;
            }

            this._dataReadyNotifier.notify(this, { navBarState: items });
        }

        protected _getContent(path: string): void {
            this._dataReadyNotifier.notify(this, { articleState: this.navigate(path) });
        }

        protected _getGroupIndex(menu: IMenuState, label: string): number {
            for (let i: number = 0; i < menu.groups.length; i++) {
                if (menu.groups[i].label === label) {
                    return i;
                }
            }
            return -1;
        }

        protected _includeInMenu(nodeKind: string): boolean {
            return true;
        }

        public navigate(path: string, dontExpandAll?: boolean): INode {

            let node: INode = this._data;

            if (path === "") {
                return node;
            }

            if (path[path.length - 1] === "/") {
                path = path.substr(0, path.length - 1);
            }

            let names: string[] = path.split("/");

            path = "";

            for (let i: number = 0; i < names.length; i++) {
                if (path.length === 0) {
                    path = names[i];
                } else {
                    path = path + "/" + names[i];
                }

                node = this._searchId(node, names[i]);

                if(node === null) {
                    throw new InvalidPathException();
                }
            }

            if (dontExpandAll && MENU_DONT_EXPAND.indexOf(node.kindString) !== -1) {
                return node.parent;
            }

            return node;
        }

        // searches for the id under given node children
        protected _searchId(node: INode, name: string): INode {

            for (let i: number = 0; i < node.children.length; i++) {
                if (node.children[i].name === name) {
                    return node.children[i];
                }
            }

            return null;

        }

        // searches for the item with the given id in the whole tree
        public getItemById(id: number): INode {
            if (this._itemsById.hasOwnProperty(id.toString())) {
                return this._itemsById[id];
            }
            return null;
        }

    }

}
