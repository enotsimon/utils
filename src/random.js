// @flow
import random from 'random'

export const randElement = <T>(arr: Array<T>): T => {
  if (arr.length === 0) {
    throw new Error('randElement input array cannot be empty')
  }
  return arr[random.int(0, arr.length - 1)]
}

export const shuffle = <T: any>(arr: Array<T>): Array<T> => arr.sort(() => random.int(0, 2) - 1)
