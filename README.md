# reduce-by-delimited
Reduces a string contents by delimiter and returns the difference and the extracted delimited content.

## General Usage:
This module is good for non nested delimited content extraction as shown below:
```
    // some-file.html
    <!-- :someMadeUpDelimAndFormat -->
    
        ... The goods go here ...
        
    <!-- :/someMadeUpDelimAndFormat -->
    
        ... Other content here ...
        
    <script>
        ... some content here ...
    </script>
    
    <style>
        ... some content here ...
    </style>
    
```

But not good for:
```       
    <!-- #otherMadeUpDelim -->
        <!-- #otherMadeUpDelim -->
            <!-- otherMadeUpDelim -->
                ... Some content here ...
            <!-- /otherMadeUpDelim -->
        <!-- /otherMadeUpDelim -->
    <!-- /otherMadeUpDelim -->
    
    <!-- Here the first open delimiter and the first closing delimiter will be used as a block (module doesn't handle nested 
    delimited content) -->
```

## Install:
`npm install reduce-by-delimited` or 
`npm install elycruz/reduce-by-delimited`

## Interface:
### reduceByDelimited (content, openingDelim, closingDelim, keepDelimInExtracted, minContentLen, aggregator)
Reduces the content passed in by any content that has been delimited by `openingDelim` and `closingDelim`.

**Note:** Method is curried up to an arity of three by default.

#### Params:
- content {String}
- openingDelim {String}
- closingDelim {String}
- keepDelimInExtracted {Boolean=false}
- minContentLen {Number=1}
- aggregator {Object={}}

#### Returns:
`{difference: {String}, extracted: {Array}}`

#### Usage:
```
var openDelim = '<!-- someDelimiter -->',
    closeDelim = '<!-- /someDelimiter -->',
    content = 
    `
        <!-- someDelimiter -->
        <meta charset="UTF-8">
        <title>Example Body Content</title>
        <meta name="description" content="Example Body Content's meta-description here." />
        <link rel="stylesheet" href="some-style-sheet-dot-css-here.css" />
        <!-- /someDelimiter -->
        
        <p>Other content here</p>
    `;
    result = rbd.reduceByDelimited(content, openDelim, closeDelim);
    
    result.difference === `
    
        <p>Other content here</p>
    ` // true
    
    result.extracted[0] === `
        <meta charset="UTF-8">
        <title>Example Body Content</title>
        <meta name="description" content="Example Body Content's meta-description here." />
        <link rel="stylesheet" href="some-style-sheet-dot-css-here.css" />
    ` // true
```

### reduceByDelimitedC4 (content, openingDelim, closingDelim, keepDelimInExtracted, minContentLen, aggregator)
Same as above but curried up to arity of 4.

### reduceByDelimitedC5 (content, openingDelim, closingDelim, keepDelimInExtracted, minContentLen, aggregator)
Same as above but curried up to arity of 5.

### hasOpeningAndClosingDelim (content, openingDelim, closingDelim, minContentLen)

**Params:**
- content {String}
- openingDelim {String}
- closingDelim {String}

## Tests:
`mocha tests/server-side`

## License:
GPL 3.0 and MIT
