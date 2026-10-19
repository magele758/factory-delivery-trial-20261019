function assertFiniteNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected a finite number');
  }
}

function decimalParts(value) {
  let text = value.toString().toLowerCase();
  let negative = false;
  if (text.startsWith('-')) {
    negative = true;
    text = text.slice(1);
  }

  let exponent = 0;
  const exponentIndex = text.indexOf('e');
  if (exponentIndex !== -1) {
    exponent = Number(text.slice(exponentIndex + 1));
    text = text.slice(0, exponentIndex);
  }

  const dot = text.indexOf('.');
  const digits = dot === -1 ? text : text.slice(0, dot) + text.slice(dot + 1);
  const point = (dot === -1 ? text.length : dot) + exponent;

  let intDigits;
  let fracDigits;
  if (point >= digits.length) {
    intDigits = digits + '0'.repeat(point - digits.length);
    fracDigits = '';
  } else if (point <= 0) {
    intDigits = '0';
    fracDigits = '0'.repeat(-point) + digits;
  } else {
    intDigits = digits.slice(0, point);
    fracDigits = digits.slice(point);
  }

  intDigits = intDigits.replace(/^0+(?=\d)/, '');
  return { negative, intDigits, fracDigits };
}

function scaledInteger(parts, scale) {
  const combined = (parts.intDigits + parts.fracDigits.padEnd(scale, '0')).replace(/^0+(?=\d)/, '');
  const magnitude = BigInt(combined);
  return parts.negative ? -magnitude : magnitude;
}

function fromScaled(total, scale) {
  const negative = total < 0n;
  const digits = (negative ? -total : total).toString().padStart(scale + 1, '0');
  if (scale === 0) {
    return negative ? -Number(digits) : Number(digits);
  }

  const intPart = digits.slice(0, -scale);
  const fracPart = digits.slice(-scale).replace(/0+$/, '');
  const text = fracPart ? `${intPart}.${fracPart}` : intPart;
  const result = Number(negative ? `-${text}` : text);
  return Object.is(result, -0) ? 0 : result;
}

export function sum(a, b) {
  assertFiniteNumber(a);
  assertFiniteNumber(b);

  const left = decimalParts(a);
  const right = decimalParts(b);
  const scale = Math.max(left.fracDigits.length, right.fracDigits.length);
  return fromScaled(scaledInteger(left, scale) + scaledInteger(right, scale), scale);
}
