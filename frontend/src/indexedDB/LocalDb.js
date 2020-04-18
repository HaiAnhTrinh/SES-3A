//may need this in the future, serve as a localStorage

export const testDb = () => {
    var database;
    var openDBRequest = window.indexedDB.open("firebaseLocalStorageDb", 1);

    openDBRequest.onsuccess = (event) => {
        database = event.target.result;
        var store = database.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage');
        console.log(store.getAll());
    };
}