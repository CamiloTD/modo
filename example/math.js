exports.add = ({ a, b }) => +a + +b;
exports.sub = ({ a, b }) => +a - +b;
exports.mul = ({ a, b }) => +a * +b;
exports.div = ({ a, b }) => +a / +b;

exports.complex = {
    pow: ({ a, b }) => Math.pow(a, b),
    sqrt: ({ a }) => Math.sqrt(a)
}