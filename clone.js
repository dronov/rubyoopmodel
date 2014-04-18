var _ = require('lodash');

obj = { a: [1, 2], b: null }

o1 = _.clone(obj, true);
o1.a[0] = 100;

var o2 = _.clone(o1, true);
o2.a[0] = 10;

console.log(o1);
console.log(o2);