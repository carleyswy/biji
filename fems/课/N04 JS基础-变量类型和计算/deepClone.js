const obj1 = {
    age: 20,
    name: 'XXX',
    address: {
        city: 'beijing'
    },
    arr: ['a', 'b', 'c']
}

const obj2 = deepClone(obj1)
obj2.address.city = 'shanghai'
console.log(obj1.address.city)
obj2.arr[0] = 'a1'
console.log(obj1.arr[0])

function deepClone(obj = {}) {   
    if (typeof obj !== 'object' || obj == null) {
        return obj
    }
    
    let result
    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = deepClone(obj[key])
        }
    }

    return result
}
