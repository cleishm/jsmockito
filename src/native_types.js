// vi:ts=2 sw=2 expandtab
JsMockito.nativeTypes = {
  'Array': {
    type: Array,
    methods: [
      'concat', 'join', 'pop', 'push', 'reverse', 'shift', 'slice', 'sort',
      'splice', 'toString', 'unshift', 'valueOf'
    ]
  },
  'Boolean': {
    type: Boolean,
    methods: [
      'toString', 'valueOf'
    ]
  },
  'Date': {
    type: Date,
    methods: [
      'getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds',
      'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset',
      'getUTCDate', 'getUTCDay', 'getUTCMonth', 'getUTCFullYear',
      'getUTCHours', 'getUTCMinutes', 'getUTCSeconds', 'getUTCMilliseconds',
      'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate',
      'setUTCMonth', 'setUTCFullYear', 'setUTCHours', 'setUTCMinutes',
      'setUTCSeconds', 'setUTCMilliseconds', 'setYear', 'toDateString',
      'toGMTString', 'toLocaleDateString', 'toLocaleTimeString',
      'toLocaleString', 'toString', 'toTimeString', 'toUTCString',
      'valueOf'
    ]
  },
  'Number': {
    type: Number,
    methods: [
      'toExponential', 'toFixed', 'toLocaleString', 'toPrecision', 'toString',
      'valueOf'
    ]
  },
  'String': {
    type: String,
    methods: [
      'anchor', 'big', 'blink', 'bold', 'charAt', 'charCodeAt', 'concat',
      'fixed', 'fontcolor', 'fontsize', 'indexOf', 'italics',
      'lastIndexOf', 'link', 'match', 'replace', 'search', 'slice', 'small',
      'split', 'strike', 'sub', 'substr', 'substring', 'sup', 'toLowerCase',
      'toUpperCase', 'valueOf'
    ]
  },
  'RegExp': {
    type: RegExp,
    methods: [
      'compile', 'exec', 'test'
    ]
  }
};
