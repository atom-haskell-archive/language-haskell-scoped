export {}
declare module 'atom' {
  interface TextBuffer {
    /// Experimental
    findAllInRange(regex: RegExp, range: Range): Promise<Array<RangeLike>>
  }
}
