/**
 * Minimal C# tokenizer for display snippets. Not a parser — just enough to
 * colour keywords, types, strings, comments and numbers convincingly.
 */
export type TokenKind = 'kw' | 'type' | 'str' | 'com' | 'num' | 'punc' | 'attr' | 'plain'
export interface Token {
  kind: TokenKind
  text: string
}

const KEYWORDS = new Set([
  'namespace', 'using', 'public', 'private', 'internal', 'protected', 'sealed', 'static', 'readonly', 'record', 'class',
  'interface', 'struct', 'new', 'return', 'var', 'async', 'await', 'get', 'init', 'set', 'string', 'int', 'bool', 'void',
  'true', 'false', 'null', 'this', 'if', 'else', 'foreach', 'in', 'where', 'required', 'const',
])

const PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\[[A-Z][A-Za-z]*(?:\(.*?\))?\])|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([{}()[\];,.<>=:?!+\-*/&|]+)/gm

export function highlightCSharp(code: string): Token[][] {
  return code.split('\n').map((line) => {
    const tokens: Token[] = []
    let last = 0
    for (const m of line.matchAll(PATTERN)) {
      const index = m.index ?? 0
      if (index > last) tokens.push({ kind: 'plain', text: line.slice(last, index) })
      const [text, com, str, num, attr, word] = m
      let kind: TokenKind = 'punc'
      if (com) kind = 'com'
      else if (str) kind = 'str'
      else if (num) kind = 'num'
      else if (attr) kind = 'attr'
      else if (word) kind = KEYWORDS.has(word) ? 'kw' : /^[A-Z]/.test(word) ? 'type' : 'plain'
      tokens.push({ kind, text })
      last = index + text.length
    }
    if (last < line.length) tokens.push({ kind: 'plain', text: line.slice(last) })
    return tokens
  })
}
