// Polyfill for IE8.
if (!String.prototype.trim) {
String.prototype.trim = function(){
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
}

if (!String.prototype.startsWith) {
String.prototype.startsWith = function(search, pos) {
  return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
};
}

if (!String.prototype.endsWith) {
String.prototype.endsWith = function(search, this_len) {
  if (this_len === undefined || this_len > this.length) {
    this_len = this.length;
  }
  return this.substring(this_len - search.length, this_len) === search;
};
}