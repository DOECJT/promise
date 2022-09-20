import { PromiseA } from './index.js'

let P: any = PromiseA
P = Promise

const p = new P((resolve, reject) => {
  setTimeout(() => {
    resolve('xixi')
  }, 1000)
  // throw new Error('error')
})
p.then(() => {
  console.log(1)
}).then(() => {
  console.log(2)
})


// p.then(
//   (result) => {
//     console.log('result', result)
//   },
//   (reason) => {
//     console.log('reason', reason)
//   }
// )
// console.log(1)
