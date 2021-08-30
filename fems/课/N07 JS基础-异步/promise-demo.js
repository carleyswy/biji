

function loadImg(src) {
    const p = new Promise(
        (resolve, reject) => {
            const img = document.createElement('img')
            img.onload = () => {
                resolve(img) // resolve里的变量会传入then里
            }
            img.onerror = () => {
                const err = new Error('error999')
                reject(err) // reject里的变量会传入catch里
            }
            img.src=src //这句写了就会触发图片的加载，onload或onerror
        }
    )

    return p
}

// const url = "http://p5.img.cctvpic.com/cportal/cnews-yz/img/2021/08/01/1627826456984_398_441x800.png"
// https://inews.gtimg.com/newsapp_bt/0/13837948802/1000
// loadImg(url).then(img => {
//     console.log(img.width)
//     return img //第一个then的return的值会传入第二个then里
// }).then(img => {
//     console.log(img.height)
// }).catch(ex => console.error(ex))

const url1 = "http://p5.img.cctvpic.com/cportal/cnews-yz/img/2021/08/01/1627826456984_398_441x800.png"
const url2 = "https://inews.gtimg.com/newsapp_bt/0/13837948802/1000"

loadImg(url1).then(img1 => {
    console.log(img1.width)
    return img1
}).then(img1 => {
    console.log(img1.height)
    return loadImg(url2)
}).then(img2 => {
    console.log(img2.width)
    return img2
}).then(img2 => {
    console.log(img2.height)
    return loadImg(url2)
})


