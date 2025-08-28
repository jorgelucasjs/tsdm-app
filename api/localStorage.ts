const storage = window.localStorage;

export function saveData(key: string, data: any, isArray: boolean = false) {
    
    if (isArray) {
        
        const store = getData(key)

        if (store) {
            const save = new Set([...store, data])
            const unique = Array.from(save)
            storage.setItem(key, JSON.stringify(unique));
        } else {
            storage.setItem(key, JSON.stringify([data]));
        }
    } else {
        storage.setItem(key, JSON.stringify(data));
    }
}

export function getData(key: string) {

    const data = storage.getItem(key);
    if (data && data?.length > 2 ) {
        return JSON.parse(data);
    }

    return null;
}

export function deleteData(key: string, data?: string, isArray: boolean = false) {

    if (isArray) {
        let store = getData(key) as unknown as any[]
        store = store.filter(value => value !== data)
        storage.setItem(key, JSON.stringify(store))

    } else {
        storage.removeItem(key);
    }
}

export function clearLocalDatabase(){
    storage.clear()
}