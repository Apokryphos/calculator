const CalcOp = {
  ADD: 1,
  SUB: 2,
  MUL: 3,
  DIV: 4,
}

function getOpString(op) {
  switch (op) {
    default:
    return '';
    case CalcOp.ADD:
      return ' + ';
    case CalcOp.SUB:
      return ' - ';
    case CalcOp.MUL:
      return ' x ';
    case CalcOp.DIV:
      return ' ÷ ';
  }
}

class Calculator {
  constructor() {
    this.stack = null;
    this.enterFlag = false;
    this.clear();
  }

  getValue() {
    return this.stack[this.stack.length - 1];
  }

  setValue(value) {
    this.stack[this.stack.length - 1] = value;
  }

  valueIsOp() {
    return typeof this.stack[this.stack.length - 1] === 'number';
  }

  valueIsString() {
    return typeof this.stack[this.stack.length - 1] === 'string';
  }

  setOp(op) {
    this.enterFlag = false;

    if (this.valueIsOp()) {
      this.setValue(op);
    } else {
      this.stack.push(op);
    }
  }

  add() {
    this.setOp(CalcOp.ADD);
  }

  backspace() {
    this.enterFlag = false;

    if (this.valueIsString()) {
      if (this.getValue().length <= 1 || this.valueIsZeroOrInfinite()) {
        this.setValue('0');
      } else {
        this.setValue(this.getValue().slice(0, -1));
      }
    }
  }

  changeSign() {
    if (this.valueIsString() && !this.valueIsZeroOrInfinite()) {
      const value = this.getValue();

      if (value.substring(0, 1) == '-') {
        this.setValue(value.substring(1));
      }
      else {
        this.setValue('-' + value);
      }
    }
  }

  clear() {
    this.stack = [ '0' ];
    this.enterFlag = false;
  }

  clearX() {
    if (this.valueIsString()) {
      this.stack[this.stack.length - 1] = '0';
      this.enterFlag = false;
    }
  }

  decimal() {
    if (this.valueIsString() && this.getValue().indexOf('.') == -1) {
      this.setValue(this.getValue() + '.');
    }
  }

  divide() {
    this.setOp(CalcOp.DIV);
  }

  exOp(op, a, b) {

    if (typeof a === 'string') {
      a = parseFloat(a);
    }

    if (typeof b === 'string') {
      b = parseFloat(b);
    }

    switch (op) {
      default:
      case CalcOp.ADD:
        return a + b;
      case CalcOp.SUB:
        return a - b;
      case CalcOp.MUL:
        return a * b;
      case CalcOp.DIV:
        return a / b;
    }
  }

  enter() {
    let result = 0;
    let op = null;
    for (let s = 0; s < this.stack.length; ++s) {

      if (typeof this.stack[s] === 'string') {
        let n = parseFloat(this.stack[s]);
        if (n !== undefined) {
          if (op === null) {
            result = n;
          }
          else {
            result = this.exOp(op, result, n);
            op = null;
          }
        }
      } else if (typeof this.stack[s] === 'number') {
        op = this.stack[s];
      }
    }

    this.stack = [ result.toString() ];
    this.enterFlag = true;
  }

  valueIsZeroOrInfinite() {
    const value = this.getValue();
    return (value === '0' || value === 'NaN' || value === 'Infinity');
  }

  enterDigit(digit) {
    if (typeof digit === 'string') {
      if (this.valueIsOp()) {
        this.stack.push(digit);
      } else if (this.enterFlag || this.valueIsZeroOrInfinite()) {
        this.setValue(digit);
        this.enterFlag = false;
      } else {
        this.setValue(this.getValue() + digit);
      }
    }
  }

  getDisplay() {
    if (this.valueIsString()) {
      return `${this.stack[this.stack.length - 1]}`;
    } else {
      return `${getOpString(this.stack[this.stack.length - 1])}`;
    }
  }

  getHistory() {
    let h = '';

    for (let s = 0; s < this.stack.length; ++s) {
      if (typeof this.stack[s] === 'string') {
        h += this.stack[s];
      } else {
        h += getOpString(this.stack[s]);
      }
    }

    return h;
  }

  multiply() {
    this.setOp(CalcOp.MUL);
  }

  pi() {
    const value = '3.14159';

    if (this.valueIsOp()) {
      this.stack.push(value);
    } else {
      this.setValue(value);
    }
  }

  subtract() {
    this.setOp(CalcOp.SUB);
  }
}

function handleInput(event) {
  let keyName = '';
  if (event.key !== undefined) {
    keyName = event.key;
  }

  switch (keyName) {

    case 'Escape':
      if (calculator.getValue() == '0') {
        calculator.clear();
      }
      else {
        calculator.clearX();
      }
      break;

    case 'Backspace':
      calculator.backspace();
      break;

    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      calculator.enterDigit(keyName);
      break;

    case '+':
      calculator.add();
      break;

    case '-':
      calculator.subtract();
      break;

    case '*':
    case 'x':
      calculator.multiply();
      break;

    case '/':
      event.preventDefault();
      calculator.divide();
      break;

    case 'Enter':
    case '=':
      calculator.enter();
      break;

    case '.':
      calculator.decimal();
      break;

    case 'p':
      calculator.pi();
      break;

    default:
      return;
  }

  updateCalculatorDisplay(calculator);
}

function updateCalculatorDisplay(calc) {
  document.getElementById('CalculatorDisplay').innerHTML = calc.getDisplay();
  document.getElementById('CalculatorHistory').innerHTML = calc.getHistory();
}

const calculator = new Calculator();

function init() {

  document.getElementById('digit1').addEventListener('click', function() {
    calculator.enterDigit('1');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit2').addEventListener('click', function() {
    calculator.enterDigit('2');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit3').addEventListener('click', function() {
    calculator.enterDigit('3');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit4').addEventListener('click', function() {
    calculator.enterDigit('4');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit5').addEventListener('click', function() {
    calculator.enterDigit('5');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit6').addEventListener('click', function() {
    calculator.enterDigit('6');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit7').addEventListener('click', function() {
    calculator.enterDigit('7');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit8').addEventListener('click', function() {
    calculator.enterDigit('8');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit9').addEventListener('click', function() {
    calculator.enterDigit('9');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('digit0').addEventListener('click', function() {
    calculator.enterDigit('0');
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('decimal').addEventListener('click', function() {
    calculator.decimal();
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('pi').addEventListener('click', function() {
    calculator.pi();
    updateCalculatorDisplay(calculator);
  });

  document.getElementById('add').addEventListener('click', function() {
     calculator.add();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('subtract').addEventListener('click', function() {
     calculator.subtract();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('multiply').addEventListener('click', function() {
     calculator.multiply();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('divide').addEventListener('click', function() {
     calculator.divide();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('enter').addEventListener('click', function() {
     calculator.enter();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('chs').addEventListener('click', function() {
     calculator.changeSign();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('clx').addEventListener('click', function() {
     calculator.clearX();
     updateCalculatorDisplay(calculator);
  });

  document.getElementById('clr').addEventListener('click', function() {
     calculator.clear();
     updateCalculatorDisplay(calculator);
  });

  document.addEventListener('keydown', (event) => handleInput(event), false);
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init);
