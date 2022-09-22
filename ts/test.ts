import { PromiseA } from './index.js'

let P: any = PromiseA
// P = Promise

const p = new P((resolve, reject) => {
  resolve(100)
  // throw new Error('error')
})
const p1 = p.then(() => p1)

// p.then(
//   (result) => {
//     console.log('result', result)
//   },
//   (reason) => {
//     console.log('reason', reason)
//   }
// )
// console.log(1)
