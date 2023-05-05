import { ParsedCell } from "./types";

const whitespaces = ["\n".charCodeAt(0), " ".charCodeAt(0), "\r".charCodeAt(0)];
const lineTerminators = ["\n".charCodeAt(0), "\r".charCodeAt(0)];

export function parseIwlistOutput(text: string) {
  text = consumeWhitespace(text);
  text = dropLine(text);

  const parsedCells: ParsedCell[] = [];

  while (text.length) {
    text = consumeWhitespace(text);
    let result = parseCell(text);
    parsedCells.push(result.cell);
    text = result.text;
  }

  return parsedCells;
}

export function parseCell(text: string) {
  text = consume("Cell", text);
  text = consumeWhitespace(text);

  const cell: ParsedCell = {};

  let result = consumeToken(text);
  cell.id = result.token;
  text = result.text;

  text = consumeWhitespace(text);
  text = consume("-", text);
  text = consumeWhitespace(text);

  text = consume("Address:", text);
  text = consumeWhitespace(text);

  result = consumeToken(text);
  cell.address = result.token;
  text = result.text;

  text = consumeWhitespace(text);
  text = dropLine(text);
  text = consumeWhitespace(text);

  text = consume("Frequency:", text);
  text = consumeWhitespace(text);

  result = consumeToken(text);
  cell.frequency = result.token;
  text = result.text;

  text = dropLine(text);
  text = consumeWhitespace(text);

  text = consume("Quality=", text);
  result = consumeToken(text);
  cell.quality = result.token;
  text = result.text;

  text = dropLine(text);
  text = consumeWhitespace(text);

  text = dropLine(text);
  text = consumeWhitespace(text);

  text = consume("ESSID:", text);
  text = consumeWhitespace(text);
  result = consumeToken(text);
  cell.essid = result.token;
  text = result.text;
  text = consumeWhitespace(text);

  while (text.length > 0 && !check("Cell", text)) {
    text = dropLine(text);
    text = consumeWhitespace(text);
  }

  return {
    cell,
    text,
  };
}

function consumeToken(text: string) {
  let i = 0;
  while (i < text.length && !isWhitespace(text.charCodeAt(i))) {
    i++;
  }

  return { token: text.slice(0, i), text: text.slice(i) };
}

function consume(token: string, text: string) {
  expect(token, text);

  return text.slice(token.length);
}

function check(expected: string, text: string) {
  return text.startsWith(expected);
}

function expect(expected: string, text: string) {
  if (!text.startsWith(expected)) {
    throw new Error(
      `expected ${expected}, got \`${text.slice(0, expected.length)}\` instead`,
    );
  }
}

function dropLine(text: string) {
  let i = 0;
  while (i < text.length && !isLineTerminator(text.charCodeAt(i))) {
    i++;
  }

  return text.slice(i + 1);
}

function consumeWhitespace(text: string) {
  let i = 0;
  while (i < text.length && isWhitespace(text.charCodeAt(i))) {
    i++;
  }

  return text.slice(i);
}

function isLineTerminator(c: number) {
  return lineTerminators.includes(c);
}

function isWhitespace(c: number) {
  return whitespaces.includes(c);
}
