import * as Atom from 'atom'
import * as rx from './regex'
import { ICompletionBackend } from 'atom-haskell-upi/completion-backend'

const selectors = [
  'identifier.haskell',
  'entity.name.type.haskell',
  'entity.name.tag.haskell',
]

const operatorSelectors = [
  'keyword.operator.haskell',
  'entity.name.function.infix.haskell',
]

const activationScopes = ['source.haskell', 'text.tex.latex.haskell']

const knownIdentClass = 'syntax--known-identifier'

export class EditorController {
  private disposed = false
  private layer: Atom.DisplayMarkerLayer
  private disposables = new Atom.CompositeDisposable()

  constructor(private editor: Atom.TextEditor, private cb: ICompletionBackend) {
    this.layer = this.editor.addMarkerLayer()
    this.disposables.add(
      this.editor.getBuffer().onDidChangeText(async ({ changes }) => {
        const sbs = await this.getSymbols()
        for (const { newRange } of changes) {
          await this.updateHighlightInRange(sbs, [
            [newRange.start.row, 0],
            [newRange.end.row + 1, 0],
          ])
        }
      }),
    )
    this.disposables.add(
      editor.onDidDestroy(() => {
        this.dispose()
      }),
    )
    // tslint:disable-next-line:no-floating-promises
    this.init()
  }

  public static shouldActivate(ed: Atom.TextEditor): boolean {
    return activationScopes.includes(ed.getGrammar().scopeName)
  }

  public dispose() {
    if (!this.disposed) {
      this.disposed = true
      this.layer.destroy()
      this.disposables.dispose()
    }
  }

  private async init() {
    await this.updateHighlightInRange(
      await this.getSymbols(),
      this.editor.getBuffer().getRange(),
    )
  }

  private async updateHighlightInRange(
    sbs: Set<string>,
    searchRange: Atom.RangeCompatible,
  ) {
    for (const marker of this.layer.findMarkers({
      intersectsBufferRange: searchRange,
    })) {
      marker.destroy()
    }
    this.editor.scanInBufferRange(
      rx.identRx,
      searchRange,
      async ({ matchText, range }) => {
        if (sbs.has(matchText)) {
          await this.decorateRange(range, selectors)
        }
      },
    )
    this.editor.scanInBufferRange(
      rx.operatorRx,
      searchRange,
      async ({ matchText, range }) => {
        if (sbs.has(matchText)) {
          await this.decorateRange(range, operatorSelectors)
        }
      },
    )
  }

  private async getSymbols() {
    const symbols = await this.cb.getCompletionsForSymbol(
      this.editor.getBuffer(),
      '',
      Atom.Point.fromObject([0, 0]),
    )
    return new Set(symbols.map(({ qname }) => qname))
  }

  private async decorateRange(range: Atom.Range, myselectors: string[]) {
    const [inScope] = this.editor
      .scopeDescriptorForBufferPosition(range.start)
      .getScopesArray()
      .filter((sel) => myselectors.includes(sel))
    if (inScope) {
      const srange = this.editor.bufferRangeForScopeAtPosition(
        inScope,
        range.start,
      )
      const marker = this.layer.markBufferRange(srange || range, {
        invalidate: 'never',
      })
      // @ts-ignore // TODO: complain on DT
      this.editor.decorateMarker(marker, {
        type: 'text',
        class: knownIdentClass,
      })
    }
  }
}
