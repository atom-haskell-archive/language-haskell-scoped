/* @flow */

const operatorSyms = /[\!\#-\&\*-\+\--\/\:\<-\@\\\^\|]+/.source
const modulePrefix = /([\w'.]+\.)?/.source

export const identifier = RegExp(`${modulePrefix}([\\w']+)`,'g')

export const operator =
RegExp(`${modulePrefix}(?:(${operatorSyms})|\\((${operatorSyms})\\))`,'g')
