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
      this.editor.getBuffer().onDidChangeText((arg) => {
        handlePromise(this.didChangeText(arg))
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
    this.updateHighlightInRange(
      await this.getSymbols(),
      this.editor.getBuffer().getRange(),
    )
  }

  private async didChangeText({ changes }: Atom.BufferStoppedChangingEvent) {
    const buffer = this.editor.getBuffer()
    const sbs = await this.getSymbols()
    for (const { newRange, oldRange } of changes) {
      for (const row of newRange.union(oldRange).getRows()) {
        this.updateHighlightInRange(sbs, buffer.rangeForRow(row))
      }
    }
  }

  private updateHighlightInRange(
    sbs: Set<string>,
    searchRange: Atom.RangeCompatible,
  ) {
    for (const marker of this.layer.findMarkers({
      intersectsBufferRange: searchRange,
    })) {
      marker.destroy()
    }
    const buffer = this.editor.getBuffer()
    const range = Atom.Range.fromObject(searchRange)

    const decorate = (idents: Atom.RangeLike[], selectors: string[]) => {
      for (const ident of idents) {
        if (sbs.has(buffer.getTextInRange(ident))) {
          this.decorateRange(ident, selectors)
        }
      }
    }

    handlePromise(
      buffer
        .findAllInRange(rx.identRx, range)
        .then((idents) => decorate(idents, selectors)),
    )

    handlePromise(
      buffer
        .findAllInRange(rx.operatorRx, range)
        .then((ops) => decorate(ops, operatorSelectors)),
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

  private decorateRange(range: Atom.RangeLike, myselectors: string[]) {
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

function handlePromise(p: Promise<void>): void {
  p.catch(function(e: Error) {
    atom.notifications.addError(
      `Something went wrong in language-haskell-scoped: ${e.name}`,
      {
        detail: e.message,
        stack: e.stack,
        dismissable: true,
      },
    )
  })
}
