/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { 
    allPass, 
    andThen, 
    compose, 
    curry, 
    flip, 
    gt, 
    ifElse, 
    length, 
    lt, 
    otherwise, 
    partial, 
    pipe, 
    prop, 
    tap, 
    test 
} from 'ramda';

import Api from '../tools/api';

const api = new Api();

const getResult = prop('result');

const ltFlip = flip(lt);
const gtFlip = flip(gt);

const lessThan10 = ltFlip(10);
const greaterThan2 = gtFlip(2);
const greaterThan0 = gtFlip(0);

const isLengthLessThan10 = compose(
    lessThan10,
    length,
);

const isLengthGreaterThan2 = compose(
    greaterThan2,
    length,
);

const isOnlyDigitContains = test(/^\d*\.?\d*$/);

const toNumber = curry(item => +item);

const isPositiveNumber = compose(
    greaterThan0,
    toNumber,
);

const isCorrentNumber = allPass([
    isLengthGreaterThan2,
    isLengthLessThan10,
    isOnlyDigitContains,
    isPositiveNumber,
]);

const round = curry(Math.round);
const pow = curry(flip(Math.pow));
const restOfDivisionOn3 = val => val % 3;

const convertToNumberRounded = compose(
    round,
    toNumber,
);

const convertTo2Digit = compose(
    api.get('https://api.tech/numbers/base'),
    (number) => ({from: 10, to: 2, number}),
);
const convertToAnimal = (id) => api.get(`https://animals.tech/${id}`, {});

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const handleErrorValidation = partial(handleError, ['Validation Error']);
    const handleErrorConvertTo2Digit = partial(handleError, ['Convert To 2-Digit Number Error']);
    const handleErrorConvertToAnimal = partial(handleError, ['Convert To Animal Error']);
    const tapWriteLog = tap(writeLog);    

    const runHandleSuccess = compose(
        handleSuccess,
        getResult,
    );

    const convertToAnimalPromisify = pipe(
        convertToAnimal,
        andThen(runHandleSuccess),
        otherwise(handleErrorConvertToAnimal),
    );

    const runConvertToAnimal = compose(
        convertToAnimalPromisify,
        
        tapWriteLog,
        restOfDivisionOn3,
        
        tapWriteLog,
        pow(2),
        
        tapWriteLog,
        length,

        tapWriteLog,
        getResult,
    );

    const convertTo2DigitPromisify = pipe(
        convertTo2Digit,
        andThen(runConvertToAnimal),
        otherwise(handleErrorConvertTo2Digit),        
    );

    const runConvertTo2Digit = compose(
        convertTo2DigitPromisify,
        tapWriteLog,
        convertToNumberRounded,
    );   

    compose(
        ifElse(isCorrentNumber, runConvertTo2Digit, handleErrorValidation),
        tapWriteLog,
    )(value);
}

export default processSequence;
