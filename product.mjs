function assertFiniteNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('Expected a finite number');
  }
}

function parseDecimal(value) {
  if (value === 0) {
    return { sign: Object.is(value, -0) ? -1n : 1n, digits: 0n, scale: 0 };
  }

  const sign = value < 0 ? -1n : 1n;
  const text = Math.abs(value).toString().toLowerCase();
  const match = text.match(/^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/);
  if (!match) {
    throw new TypeError('Expected a finite number');
  }

  const fraction = match[2] ?? '';
  const exponent = match[3] ? Number(match[3]) : 0;
  const digits = (match[1] + fraction).replace(/^0+/, '') || '0';

  return {
    sign,
    digits: BigInt(digits),
    scale: fraction.length - exponent,
  };
}

function formatDecimal(sign, digits, scale) {
  if (digits === 0n) {
    return sign < 0n ? -0 : 0;
  }

  let body = digits.toString();
  if (scale > 0) {
    if (body.length <= scale) {
      body = body.padStart(scale, '0');
      body = `0.${body}`;
    } else {
      const split = body.length - scale;
      body = `${body.slice(0, split)}.${body.slice(split)}`;
    }
  } else if (scale < 0) {
    body += '0'.repeat(-scale);
  }

  return Number(sign < 0n ? `-${body}` : body);
}

export function product(a, b) {
  assertFiniteNumber(a);
  assertFiniteNumber(b);

  const left = parseDecimal(a);
  const right = parseDecimal(b);

  return formatDecimal(
    left.sign * right.sign,
    left.digits * right.digits,
    left.scale + right.scale,
  );
}
