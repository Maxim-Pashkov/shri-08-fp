/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
    all, 
    allPass, 
    compose, 
    equals, 
    prop, 
    complement,     
    values, 
    filter, 
    lte, 
    length, 
    countBy, 
    apply, 
    uniq, 
    mergeDeepRight, 
    anyPass, 
    pickAll, 
    pickBy,     
    mergeDeepLeft, 
    head,
    isEmpty
} from 'ramda';

const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');

const isRed = equals('red');
const isWhite = equals('white');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');

const isNotWhite = complement(isWhite);

const isRedOrIsBlue = anyPass([
    isRed,
    isBlue,
]);

const isRedStar = compose(isRed, getStar);
const isWhiteTriangle = compose(isWhite, getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);
const isGreenSquare = compose(isGreen, getSquare);
const isGreenTriangle = compose(isGreen, getTriangle);
const isBlueCircle = compose(isBlue, getCircle);
const isOrangeSquare = compose(isOrange, getSquare);

const isNotRedStar = complement(isRedStar);
const isNotWhiteStar = compose(isNotWhite, getStar);

const filterGreen = filter(isGreen);
const filterRed = filter(isRed);

const getCount = filterFn => compose(
    length,
    filterFn,
    values,
);

const getCountGreen = getCount(filterGreen);
const getCountRed = getCount(filterRed);

const isAtLeastTwoGreen = compose(
    lte(2),
    getCountGreen,
);

const isTwoGreen = compose(
    equals(2),
    getCountGreen,
)

const isOneRed = compose(
    equals(1),
    getCountRed,
);

const counts = compose(
    countBy(val => val),
    values,
);

const allIsOrange = compose(
    all(isOrange),
    values,
);

const allIsGreen = compose(
    all(isGreen),
    values,
);

const isNotEmpty = complement(isEmpty);

const getMax = apply(Math.max);

const exceptWhite = pickBy(isNotWhite);

const pickOnlyRedAndBlue = pickBy(isRedOrIsBlue);

const pickTriangleAndSquare = pickAll(['triangle', 'square']);

const firstNotEmpty = compose(
    head,
    filter(Boolean),
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isRedStar,
    isGreenSquare,
    isWhiteTriangle,
    isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = isAtLeastTwoGreen;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
    equals(1),
    length,
    uniq,
    values,
    mergeDeepRight({red: 0, blue: 0}),
    counts,
    pickOnlyRedAndBlue,
);

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([
    isBlueCircle,
    isRedStar,
    isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    lte(3),
    getMax,
    values,
    counts,
    exceptWhite,
);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = allPass([
    isTwoGreen,
    isGreenTriangle,
    isOneRed,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
    isNotEmpty,
    allIsOrange,
]);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = allPass([
    isNotRedStar,
    isNotWhiteStar,
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
    isNotEmpty,
    allIsGreen,
]);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = compose(
    equals(2),
    firstNotEmpty,
    values,
    mergeDeepLeft({white: 0}),
    counts,
    pickTriangleAndSquare,
);
