# language-haskell-scoped package

**WARNING:** Uses some horrible hacks, so not at all guaranteed to work.

This is an experimental package. Once code is mature enough, it will likely be merged into language-haskell.

Highlight identifiers in current scope in Haskell sources.

![image](https://cloud.githubusercontent.com/assets/7275622/18029773/43059168-6caa-11e6-86c3-2af51d9fdd4a.png)

Dependencies:

- language-haskell
- haskell-ghc-mod

Default style, which lightens highlight color, works relatively well only for dark themes. You can define your own in Edit → Stylesheet...

```less
atom-text-editor::shadow {
  .known-identifier.haskell {
    -webkit-filter: brightness(100%); //disable default style
  }
  .known-identifier.identifier.haskell {
    color: red; // set your preferred color here
  }
  .known-identifier.tag.haskell { // Type constructors
    color: green; // set your preferred color here
  }
  .known-identifier.type.haskell {
    color: blue; // set your preferred color here
  }
  .prelude.haskell { // to disable built-in Prelude highlighting
    color: inherit !important;
  }
}
```
