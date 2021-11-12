import { 
    validateFieldN1, 
    validateFieldN10, 
    validateFieldN2,
    validateFieldN3,
    validateFieldN4,
    validateFieldN5,
    validateFieldN6,
    validateFieldN7,
    validateFieldN8,
    validateFieldN9
} from './validators';

const generateCombinations = () => {
    const keys = ['square', 'star', 'triangle', 'circle'];
    const values = ['white', 'red', 'blue', 'orange', 'green'];

    const generateItem = (obj, keys) => {
        obj = {...obj};
        keys = [...keys];
        const key = keys.shift();

        const results = [];
        for(const value of values) {
            const objItem = {...obj};
            objItem[key] = value;
            if(!keys.length) {
                results.push(objItem);
            } else {
                results.push(...generateItem(objItem, keys));
            }
        }

        return results;
    }

    return generateItem({}, keys);    
};

const combinations = generateCombinations();

const generateData = (fnResult, additional = []) => {
    return [...combinations, ...additional].map(item => {
        const result = fnResult(item);
        return [item, result];
    });
};

const dataExpect = (data, fn) => {
    data.forEach(([item, result]) => {
        expect({item, result: fn(item)}).toEqual({item, result});
    });
}

it('1.Красная звезда, зеленый квадрат, все остальные белые', () => {
    const data = generateData(({star, square, ...rest}) => {
        return star === 'red' && square === 'green' && Object.values(rest).every(val => val === 'white');
    });

    dataExpect(data, validateFieldN1);
});

it('2. Как минимум две фигуры зеленые.', () => {
    const data = generateData(item => Object.values(item).filter(val => val === 'green').length >= 2);

    dataExpect(data, validateFieldN2);
});

it('3. Количество красных фигур равно кол-ву синих.', () => {
    const data = generateData(item => {
        const values = Object.values(item);

        return values.filter(val => val === 'red').length === values.filter(val => val === 'blue').length;
    });

    dataExpect(data, validateFieldN3);
});

it('4. Синий круг, красная звезда, оранжевый квадрат', () => {
    const data = generateData(({circle, star, square}) => circle === 'blue' && star === 'red' && square === 'orange');

    dataExpect(data, validateFieldN4);
});

it('5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).', () => {
    const data = generateData(item => {
        const values = Object.values(item);

        const counts = values.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});

        delete counts.white;

        return Math.max(...Object.values(counts)) >= 3;
    });

    dataExpect(data, validateFieldN5);
});

it('6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.', () => {
    const data = generateData(({triangle, ...rest}) => {
        const restValues = Object.values(rest);
        return triangle === 'green' && restValues.filter(val => val === 'green').length === 1 && restValues.filter(val => val === 'red').length === 1;
    });

    dataExpect(data, validateFieldN6);
});

it('7. Все фигуры оранжевые.', () => {
    const data = generateData(item => Object.values(item).every(val => val === 'orange'));
    data.push([{}, false]);

    dataExpect(data, validateFieldN7);
});

it('8. Не красная и не белая звезда.', () => {
    const data = generateData(({star}) => !['white', 'red'].includes(star));

    dataExpect(data, validateFieldN8);
});

it('9. Все фигуры зеленые.', () => {
    const data = generateData(item => Object.values(item).every(val => val === 'green'));
    data.push([{}, false]);

    dataExpect(data, validateFieldN9);
});

it('10. Треугольник и квадрат одного цвета (не белого)', () => {
    const data = generateData(({triangle, square}) => triangle === square && triangle !== 'white');

    dataExpect(data, validateFieldN10);
});