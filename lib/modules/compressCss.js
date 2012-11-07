module.exports = function(str){
    return str.replace(/\/\*.*?\*\/|[\t\r\n]+/g, '')
        .replace(/ *(\{|\}|\:|\,|\;) */g, '$1')
        .replace(/( |\:)0(?:px|em|ex|pt)/g, '$10');
}
