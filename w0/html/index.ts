const isSymbol: symbol = Symbol('symbol');

const user = {
  name: '유녕',
  [isSymbol]: '비밀입니다요',
};

console.log(user.name);
console.log(user[isSymbol]);   
console.log(Object.keys(user)); 