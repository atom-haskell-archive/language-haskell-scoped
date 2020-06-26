"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorRx = exports.identRx = void 0;
const XRegExp = require("xregexp");
const identCharClass = `[\\p{Ll}_\\p{Lu}\\p{Lt}\\p{Nd}']`;
const classNameOne = `[\\p{Lu}\\p{Lt}]${identCharClass}*`;
const className = `${classNameOne}(?:\\.${classNameOne})*`;
const modulePrefix = `(?:${className}\\.)?`;
const operatorChar = '(?:(?![(),;\\[\\]`{}_"\'])[\\p{S}\\p{P}])';
const operator = `${operatorChar}+`;
exports.identRx = XRegExp(`(${modulePrefix})(${identCharClass}+)`, 'gu');
exports.operatorRx = XRegExp(`(${modulePrefix})(${operator})`, 'gu');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVnZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLE1BQU0sY0FBYyxHQUFHLGtDQUFrQyxDQUFBO0FBQ3pELE1BQU0sWUFBWSxHQUFHLG1CQUFtQixjQUFjLEdBQUcsQ0FBQTtBQUN6RCxNQUFNLFNBQVMsR0FBRyxHQUFHLFlBQVksU0FBUyxZQUFZLElBQUksQ0FBQTtBQUMxRCxNQUFNLFlBQVksR0FBRyxNQUFNLFNBQVMsT0FBTyxDQUFBO0FBQzNDLE1BQU0sWUFBWSxHQUFHLDJDQUEyQyxDQUFBO0FBQ2hFLE1BQU0sUUFBUSxHQUFHLEdBQUcsWUFBWSxHQUFHLENBQUE7QUFDdEIsUUFBQSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksWUFBWSxLQUFLLGNBQWMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2hFLFFBQUEsVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLFlBQVksS0FBSyxRQUFRLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBYUmVnRXhwID0gcmVxdWlyZSgneHJlZ2V4cCcpXG4vLyBGcm9tIGxhbmd1YWdlLWhhc2tlbGxcbmNvbnN0IGlkZW50Q2hhckNsYXNzID0gYFtcXFxccHtMbH1fXFxcXHB7THV9XFxcXHB7THR9XFxcXHB7TmR9J11gXG5jb25zdCBjbGFzc05hbWVPbmUgPSBgW1xcXFxwe0x1fVxcXFxwe0x0fV0ke2lkZW50Q2hhckNsYXNzfSpgXG5jb25zdCBjbGFzc05hbWUgPSBgJHtjbGFzc05hbWVPbmV9KD86XFxcXC4ke2NsYXNzTmFtZU9uZX0pKmBcbmNvbnN0IG1vZHVsZVByZWZpeCA9IGAoPzoke2NsYXNzTmFtZX1cXFxcLik/YFxuY29uc3Qgb3BlcmF0b3JDaGFyID0gJyg/Oig/IVsoKSw7XFxcXFtcXFxcXWB7fV9cIlxcJ10pW1xcXFxwe1N9XFxcXHB7UH1dKSdcbmNvbnN0IG9wZXJhdG9yID0gYCR7b3BlcmF0b3JDaGFyfStgXG5leHBvcnQgY29uc3QgaWRlbnRSeCA9IFhSZWdFeHAoYCgke21vZHVsZVByZWZpeH0pKCR7aWRlbnRDaGFyQ2xhc3N9KylgLCAnZ3UnKVxuZXhwb3J0IGNvbnN0IG9wZXJhdG9yUnggPSBYUmVnRXhwKGAoJHttb2R1bGVQcmVmaXh9KSgke29wZXJhdG9yfSlgLCAnZ3UnKVxuIl19