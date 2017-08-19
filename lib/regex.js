"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XRegExp = require("xregexp");
const identCharClass = `[\\p{Ll}_\\p{Lu}\\p{Lt}\\p{Nd}']`;
const classNameOne = `[\\p{Lu}\\p{Lt}]${identCharClass}*`;
const className = `${classNameOne}(?:\\.${classNameOne})*`;
const modulePrefix = `(?:${className}\\.)?`;
const operatorChar = '(?:(?![(),;\\[\\]`{}_"\'])[\\p{S}\\p{P}])';
const operator = `${operatorChar}+`;
exports.identRx = XRegExp(`(${modulePrefix})(${identCharClass}*)$`, 'u');
exports.operatorRx = XRegExp(`(${modulePrefix})(${operator})$`, 'u');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVnZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFFbkMsTUFBTSxjQUFjLEdBQUcsa0NBQWtDLENBQUE7QUFDekQsTUFBTSxZQUFZLEdBQUcsbUJBQW1CLGNBQWMsR0FBRyxDQUFBO0FBQ3pELE1BQU0sU0FBUyxHQUFHLEdBQUcsWUFBWSxTQUFTLFlBQVksSUFBSSxDQUFBO0FBQzFELE1BQU0sWUFBWSxHQUFHLE1BQU0sU0FBUyxPQUFPLENBQUE7QUFDM0MsTUFBTSxZQUFZLEdBQUcsMkNBQTJDLENBQUE7QUFDaEUsTUFBTSxRQUFRLEdBQUcsR0FBRyxZQUFZLEdBQUcsQ0FBQTtBQUN0QixRQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxZQUFZLEtBQUssY0FBYyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDaEUsUUFBQSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksWUFBWSxLQUFLLFFBQVEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFhSZWdFeHAgPSByZXF1aXJlKCd4cmVnZXhwJylcbi8vIEZyb20gbGFuZ3VhZ2UtaGFza2VsbFxuY29uc3QgaWRlbnRDaGFyQ2xhc3MgPSBgW1xcXFxwe0xsfV9cXFxccHtMdX1cXFxccHtMdH1cXFxccHtOZH0nXWBcbmNvbnN0IGNsYXNzTmFtZU9uZSA9IGBbXFxcXHB7THV9XFxcXHB7THR9XSR7aWRlbnRDaGFyQ2xhc3N9KmBcbmNvbnN0IGNsYXNzTmFtZSA9IGAke2NsYXNzTmFtZU9uZX0oPzpcXFxcLiR7Y2xhc3NOYW1lT25lfSkqYFxuY29uc3QgbW9kdWxlUHJlZml4ID0gYCg/OiR7Y2xhc3NOYW1lfVxcXFwuKT9gXG5jb25zdCBvcGVyYXRvckNoYXIgPSAnKD86KD8hWygpLDtcXFxcW1xcXFxdYHt9X1wiXFwnXSlbXFxcXHB7U31cXFxccHtQfV0pJ1xuY29uc3Qgb3BlcmF0b3IgPSBgJHtvcGVyYXRvckNoYXJ9K2BcbmV4cG9ydCBjb25zdCBpZGVudFJ4ID0gWFJlZ0V4cChgKCR7bW9kdWxlUHJlZml4fSkoJHtpZGVudENoYXJDbGFzc30qKSRgLCAndScpXG5leHBvcnQgY29uc3Qgb3BlcmF0b3JSeCA9IFhSZWdFeHAoYCgke21vZHVsZVByZWZpeH0pKCR7b3BlcmF0b3J9KSRgLCAndScpXG4iXX0=