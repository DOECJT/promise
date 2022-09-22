import { Func } from './utils.js'

type Resolve = (arg: any) => any
type Reject = (arg: any) => any

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    throw new TypeError('Chaining cycle detected for promise xixi')
  }
  if (x instanceof PromiseA) {
    x.then(
      y => {
        resolvePromise(promise, y, resolve, reject)
      },
      error => {
        reject(error)
      }
    )
  }
}

export class PromiseA<T> {
  private static PENDING = 'pending'
  private static FULFILLED = 'fulfilled'
  private static REJECTED = 'rejected'
  
  private PromiseState = PromiseA.PENDING
  private PromiseResult: any

  private onFulfilledCallbacks = []
  private onRejectedCallbacks = []
  constructor(fn: (resolve: Resolve, reject: Reject) => any) {
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (reason) {
      this.reject(reason)
    }
  }

  resolve(result: any) {
    if (this.PromiseState === PromiseA.PENDING) {
      this.PromiseState = PromiseA.FULFILLED
      this.PromiseResult = result
    }
    if (this.onFulfilledCallbacks.length > 0) {
      this.onFulfilledCallbacks.forEach(fn => {
        queueMicrotask(() => {
          fn(result)
        })
      })
    }
  }
  reject(reason: any) {
    if (this.PromiseState === PromiseA.PENDING) {
      this.PromiseState = PromiseA.REJECTED
      this.PromiseResult = reason
    }
    if (this.onRejectedCallbacks.length > 0) {
      this.onRejectedCallbacks.forEach(fn => {
        queueMicrotask(() => {
          fn(reason)
        })
      })
    }
  }

  then(onFulfilled?: Func, onRejected?: Func) {
    // onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    // onRejected = typeof onRejected === 'function'
    //   ? onRejected
    //   : (reason) => {
    //     throw reason
    //   }
    
    const promise = new Promise((resolve, reject) => {
      if (this.PromiseState === PromiseA.FULFILLED) {
        queueMicrotask(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.PromiseResult)
            } else {
              const x = onFulfilled(this.PromiseResult)
              resolvePromise(promise, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
        // resolve(this.PromiseResult)
      } else if (this.PromiseState === PromiseA.REJECTED) {
        queueMicrotask(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.PromiseResult)
            } else {
              const x = onRejected(this.PromiseResult)
              resolvePromise(promise, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
        reject(this.PromiseResult)
      } else if (this.PromiseState === PromiseA.PENDING) {
        this.onFulfilledCallbacks.push((result) => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.PromiseResult)
            } else {
              const x = onFulfilled(result)
              resolvePromise(promise, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
        this.onRejectedCallbacks.push((reason) => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.PromiseResult)
            } else {
              const x = onRejected(reason)
              resolvePromise(promise, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
    })

    return promise
  }
}
