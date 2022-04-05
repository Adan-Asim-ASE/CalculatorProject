var displayScreen = document.querySelector('.display-screen');
var resultScreen = document.querySelector('.result-screen');
var btn = document.querySelectorAll('.btn');

var variablesObject = new Object();
var array = [
    // { 
    //   expression: 0,
    //     result: 0
    // }
];

for (item of btn) {
    item.addEventListener('click', (n) => {
        btnText = n.target.innerText;

        if (btnText == 'x') {
            btnText = '*';
        }
        else if (btnText == 'x') {
            btnText = '*';
        }
        else if (btnText == 'sin') {
            btnText = 'sin(';
        }
        else if (btnText == 'cos') {
            btnText = 'cos(';
        }
        else if (btnText == 'tan') {
            btnText = 'tan(';
        }
        else if (btnText == 'x!') {
            btnText = '!';
        }
        else if (btnText == 'π') {
            btnText = '3.1416';
        }
        else if (btnText == 'e') {
            btnText = '2.7182';
        }
        else if (btnText == 'log') {
            btnText = 'log(';
        }
        else if (btnText == 'xy') {
            btnText = '^';
        }
        else if (btnText == '2√') {
            btnText = 'sqt(';
        }

        if (btnText != 'AC' && btnText != '<' && btnText != '=')
            displayScreen.value += btnText;
    });
}

function AC() {
    displayScreen.value = " ";
    resultScreen.value = "0";
}

function backspace() {
    displayScreen.value = displayScreen.value.substr(0, displayScreen.value.length - 1);
}

function solve() {
    let val = displayScreen.value;

    for(o of Object.keys(variablesObject)) {
        console.log(o, variablesObject[o]);
        val = val.replaceAll(o, variablesObject[o]);
    }
    
    let postFix = InfixtoPostfix(val);
    resultScreen.value = evaluatePostfix(postFix);

    saveInHistory(val, resultScreen.value);
    refreshHistory();
};

var stackArray = [];
var topp = -1;

function push(e) {
    topp++;
    stackArray[topp] = e;
}

function pop() {
    if (topp == -1)
        return 0;
    else {
        var popped_ele = stackArray[topp];
        topp--;
        return popped_ele;
    }
}

function operator(op) {
    if (op == '+' || op == '-' ||
        op == '^' || op == '*' ||
        op == '/' || op == '(' ||
        op == ')' || op == 'sin' ||
        op == 'cos' || op == 'tan' ||
        op == 'log' || op == '' ||
        op == 'sqt'

    ) {
        return true;
    }
    else
        return false;
}

function precedency(pre) {
    if (pre == '@' || pre == '(' || pre == ')') {
        return 1;
    }
    else if (pre == '+' || pre == '-') {
        return 2;
    }
    else if (pre == '/' || pre == '*') {
        return 3;
    }
    else if (pre == '^') {
        return 4;
    }
    else if (pre == 'sin' || pre == 'cos' || pre == 'tan' || pre == 'log' || pre == 'sqt') {
        return 5;
    }
    else
        return 0;
}

function InfixtoPostfix(infixval) {

    var postfix = [];
    var temp = 0;
    push('@');

    for (var i = 0; i < infixval.length; i++) {
        let el = infixval[i];

        if (el == 's' || el == 'c' || el == 't' || el == 'l') {
            var f = el + infixval[++i] + infixval[++i];
            el = f;
        }
        if (operator(el)) {
            if (el == ')') {
                while (stackArray[topp] != "(") {
                    postfix[temp++] = pop();
                }
                pop();
            }
            else if (el == '(') {
                push(el);
            }

            else if (precedency(el) > precedency(stackArray[topp])) {
                push(el);
            }
            else {
                while (precedency(el) <=
                    precedency(stackArray[topp]) && topp > -1) {
                    postfix[temp++] = pop();
                }
                push(el);
            }
        }
        else {
            if ((el >= '0' && el <= '9') || el == '.') {
                let n = el;
                while ((infixval[i + 1] >= '0' && infixval[i + 1] <= '9') || infixval[i + 1] == '.') {
                    el = infixval[++i];
                    if (el == '.') {
                        n += '.';
                        continue;
                    }
                    n += el;
                }
                postfix[temp++] = n;
            }
        }
    }
    while (stackArray[topp] != '@') {
        postfix[temp++] = pop();
    }

    var st = "";
    for (var i = 0; i < postfix.length; i++)
        st += (postfix[i] + " ");

    return st;
}

function evaluatePostfix(exp) {
    let stack = [];

    for (let i = 0; i < exp.length; i++) {
        let c = exp[i];

        if (c == ' ') {
            continue;
        }

        else if ((c >= '0' && c <= '9') || c == '.') {
            let n = c;
            while ((exp[i + 1] >= '0' && exp[i + 1] <= '9') || exp[i + 1] == '.') {
                c = exp[++i];
                if (c == '.') {
                    n += '.';
                    continue;
                }
                n += c;
            }
            stack.push(n);
        }
        else {
            if (c == 's' || c == 'c' || c == 't' || c == 'l') {
                var f = c + exp[++i] + exp[++i];
                c = f;

                let val1 = parseFloat(stack.pop());
                console.log(val1);
                let res;

                switch (c) {
                    case 'sin':
                        stack.push(Math.sin(val1));
                        break;

                    case 'cos':
                        stack.push(Math.cos(val1));
                        break;

                    case 'tan':
                        stack.push(Math.tan(val1));
                        break;

                    case 'log':
                        stack.push(Math.log(val1));
                        break;

                    case 'sqt':
                        stack.push(Math.sqrt(val1));
                        break;
                }
            }
            else {
                let val1 = parseFloat(stack.pop());
                let val2 = parseFloat(stack.pop());

                switch (c) {
                    case '+':
                        stack.push(val2 + val1);
                        break;

                    case '-':
                        stack.push(val2 - val1);
                        break;

                    case '/':
                        stack.push(parseInt(val2 / val1, 10));
                        break;

                    case '*':
                        stack.push(val2 * val1);
                        break;
                    case '^':
                        stack.push(Math.pow(val2, val1));
                        break;
                }
            }
        }
    }
    return stack.pop();
}

function createVariable()
{
    const name = document.getElementById('variableName').value;
    const val = document.getElementById('variableValue').value;

    variablesObject[name] = val;
}


function saveInHistory(exp, res)
{
    let h = { 
        expression: exp,
        result: res
    }
    array.unshift({h});

    if(array.length>4)
    {
        array.pop();
    }
}

function refreshHistory()
{
    for(i=0;i<4;i++) {
        document.getElementById("expression" + (i+1)).innerHTML = ("=> " + array[i].h.expression);
        document.getElementById("result" + (i+1)).innerHTML = ("= " +array[i].h.result);
    }
}