export function compareObjects(obj1, obj2, options = { findDifferences: false, findDifferencesremove: false }) {
    // so sánh khác nhau và trả về true/ false
    function deepEqual(objA, objB) {
        if (typeof objA !== 'object' || typeof objB !== 'object') {
            return objA === objB;
        }

        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (!deepEqual(objA[key], objB[key])) {
                return false;
            }
        }

        return true;
    }
    // // tìm kiếm sự khác nhau giữa hai object
    // function findDifferences(objA, objB) {
    //     const differences = {};
    //     console.log('deepEqual', deepEqual)
    //     Object.keys(objA).forEach(key => {
    //         const item1 = objA[key];
    //         const item2 = objB[key];

    //         if (!deepEqual(item1, item2)) {
    //             differences[key] = { oldValue: item1, newValue: item2 };
    //         }
    //     });

    //     return differences;
    // }

    function findDifferences(objA, objB) {
        const differences = {};

        // Xác định tất cả các khóa có trong objA và objB
        const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

        // Duyệt qua từng khóa và kiểm tra sự khác biệt giữa các giá trị tương ứng
        allKeys.forEach(key => {
            const item1 = objA[key];
            const item2 = objB[key];

            // Nếu giá trị của các khóa không bằng nhau, thêm vào đối tượng differences
            if (!deepEqual(item1, item2)) {
                differences[key] = { oldValue: item1, newValue: item2 };
            }
        });

        return differences;
    }

    function findDifferencesremove(objA, objB) {
        const differencesremove = {};

        // Duyệt qua từng phần tử trong objA
        for (const keyA in objA) {
            if (objA.hasOwnProperty(keyA)) {
                const itemA = objA[keyA];
                let found = false;

                // Duyệt qua từng phần tử trong objB để tìm phần tử tương ứng
                for (const keyB in objB) {
                    if (objB.hasOwnProperty(keyB)) {
                        const itemB = objB[keyB];

                        // Kiểm tra xem có phần tử tương ứng hay không
                        if (deepEqual(itemA, itemB)) {
                            found = true;
                            break;
                        }
                    }
                }

                // Nếu không tìm thấy phần tử tương ứng trong objB, đánh dấu là đã bị xóa
                if (!found) {
                    differencesremove[keyA] = { oldValue: itemA, newValue: undefined };
                }
            }
        }

        // Duyệt qua từng phần tử trong objB
        for (const keyB in objB) {
            if (objB.hasOwnProperty(keyB)) {
                const itemB = objB[keyB];
                let found = false;

                // Duyệt qua từng phần tử trong objA để tìm phần tử tương ứng
                for (const keyA in objA) {
                    if (objA.hasOwnProperty(keyA)) {
                        const itemA = objA[keyA];

                        // Kiểm tra xem có phần tử tương ứng hay không
                        if (deepEqual(itemA, itemB)) {
                            found = true;
                            break;
                        }
                    }
                }

                // Nếu không tìm thấy phần tử tương ứng trong objA, đánh dấu là đã được thêm vào
                if (!found) {
                    differencesremove[keyB] = { oldValue: undefined, newValue: itemB };
                }
            }
        }

        return differencesremove;
    }

    // function findDifferencesremove(objA, objB) {
    //     const differencesremove = {};

    //     // Duyệt qua từng khóa trong objA và kiểm tra sự khác biệt
    //     for (const key in objA) {
    //         if (objA.hasOwnProperty(key)) {
    //             const item1 = objA[key];
    //             const item2 = objB[key];

    //             // Kiểm tra sự khác biệt giữa các giá trị tương ứng
    //             if (!deepEqual(item1, item2)) {
    //                 differencesremove[key] = { oldValue: item1, newValue: item2 };
    //             }
    //         }
    //     }

    //     return differencesremove;
    // }

    function deepCompare(objA, objB) {
        if (typeof objA !== 'object' || typeof objB !== 'object') {
            return objA === objB;
        }

        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return keysA.length > keysB.length ? 'objA' : 'objB';
        }

        for (const key of keysA) {
            const comparisonResult = deepCompare(objA[key], objB[key]);
            if (comparisonResult !== true) {
                return comparisonResult;
            }
        }

        return 'True';
    }

    // if (options.findDifferences) {
    //     return findDifferences(obj1, obj2);
    // } else {
    //     return {
    //         isEqual: deepEqual(obj1, obj2),
    //         deepCompare: deepCompare(obj1, obj2),
    //     };
    //     // return deepEqual(obj1, obj2);
    // }

    if (options.findDifferences) {
        return findDifferences(obj1, obj2);
    } else if (options.findDifferencesremove) {
        return findDifferencesremove(obj1, obj2);
    } else {
        return {
            isEqual: deepEqual(obj1, obj2),
            deepCompare: deepCompare(obj1, obj2),
        };
    }
}

export function convertDifferencesToObject(data) {
    const resultObject = {};
    for (const key in data) {
        resultObject[key] = data[key].newValue;
    }

    return resultObject;
}