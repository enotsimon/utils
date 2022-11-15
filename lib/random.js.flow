// @flow
import random from 'random'
// $FlowIgnore
import seedrandom from 'seedrandom'
import * as R from 'ramda'

export type WeightId = any
export type WeightsConfigElement = {| id: WeightId, weight: number |}
export type WeightsConfig = Array<{ ...WeightsConfigElement }>
export type RandMinMaxFunc = (min: number, max: number) => number
export type RandFloatFunc = () => number

// не знаю что не так с пакетом random видимо биндинги на функциях, если не сделать такое то он функций не видит
const ri = random.int.bind(random)
const rf = random.float.bind(random)

export const initRandom = (seed: ?number = null): void => {
  random.use(seedrandom(seed || Date.now()))
}

export const randomByWeight = (config: WeightsConfig, rand: RandMinMaxFunc = rf): ?WeightId => {
  const max = R.reduce((acc, { weight }) => acc + weight, 0, config)
  const randValue = rand(0, max)
  const res = R.reduceWhile(
    // id === null for case when randValue = 0
    ({ id, sum }) => (id === null) || sum <= randValue,
    (acc, e) => {
      return { id: e.id, sum: acc.sum + e.weight }
    },
    { id: null, sum: 0 },
    config
  )
  return res.id
}

export const randNth = (list: Array<any>, rand: RandFloatFunc = rf): any =>
  R.nth(Math.floor(rand() * list.length))(list)

export const randElement = <T>(arr: Array<T>, rand: RandMinMaxFunc = ri): T => {
  if (arr.length === 0) {
    throw new Error('randElement input array cannot be empty')
  }
  return arr[rand(0, arr.length - 1)]
}

export const shuffle = <T: any>(arr: Array<T>, rand: RandMinMaxFunc = ri): Array<T> =>
  arr.sort(() => rand(0, 2) - 1)
