"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


// я пробовал всякие оптимизации -- быстрые сравнения на границы кватдаров, ромбов
// но эта функция быстрее их! видимо движок оптимизирует лучше меня

// это собрание геометрических утилит
// родилось это для оптимизаций расчета всяких сил
// многое из utils.js надо перенести сюда
// import * as R from 'ramda'

// type Radians = number
// type Degrees = number

const isInCircle = exports.isInCircle = (radius, { x, y }) => x ** 2 + y ** 2 < radius ** 2;