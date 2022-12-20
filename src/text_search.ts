import algoliasearch, { SearchClient } from "algoliasearch";

import {
    FirestoreTextSearchController,
    performAlgoliaTextSearch
} from "@camberi/firecms";

let client: SearchClient | undefined = undefined;
// process is defined for react-scripts builds
// if (typeof process !== "undefined") {
    
//     if (process.env.REACT_APP_ALGOLIA_APP_ID && process.env.REACT_APP_ALGOLIA_SEARCH_KEY) {
        client = algoliasearch("BC02XU9IHC", "a033078b436b70b03fe9c62a50e1ff48");
    // }
// }
// import.meta is defined for vite builds
// else if (import.meta.env) {
//     console.log(import.meta.env.VITE_ALGOLIA_APP_ID);
//     if (import.meta.env.VITE_ALGOLIA_APP_ID && import.meta.env.VITE_ALGOLIA_SEARCH_KEY) {
//         client = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID as string, import.meta.env.VITE_ALGOLIA_SEARCH_KEY as string);
//     }
    
// } else {
//     console.error("REACT_APP_ALGOLIA_APP_ID or REACT_APP_ALGOLIA_SEARCH_KEY env variables not specified");
//     console.error("Text search not enabled");
// }

const ordersIndex = client && client.initIndex("userOrders");
const usersIndex = client && client.initIndex("users");
const transactionsIndex = client && client.initIndex("userTransactions");
const cartIndex = client && client.initIndex("userCarts");
const categoriesIndex = client && client.initIndex("categories");
const rolesIndex = client && client.initIndex("roles");



export const textSearchController: FirestoreTextSearchController =
    ({path, searchString}) => {
        if (path === "userOrders")
            return ordersIndex && performAlgoliaTextSearch(ordersIndex, searchString);
        if (path === "users")
            return usersIndex && performAlgoliaTextSearch(usersIndex, searchString);
        if (path === "userTransactions")
            return transactionsIndex && performAlgoliaTextSearch(transactionsIndex, searchString);
            if (path === "userCarts")
            return cartIndex && performAlgoliaTextSearch(cartIndex, searchString);
            if (path === "categories")
            return categoriesIndex && performAlgoliaTextSearch(categoriesIndex, searchString);
            if (path === "roles")
            return rolesIndex && performAlgoliaTextSearch(rolesIndex, searchString);
        return undefined;
    };