import * as Atom from 'atom'
import * as rx from './regex'

const selectors = [
  'identifier.haskell',
  'entity.name.type.haskell',
  'entity.name.tag.haskell'
]

const operatorSelectors = [
  'keyword.operator.haskell',
  'entity.name.function.infix.haskell'
]

const activationScopes = [
  'source.haskell',
  'text.tex.latex.haskell'
]

const knownIdentClass = 'syntax--known-identifier'

type CBService = UPI.CompletionBackend.ICompletionBackend
let resolveCB: ((val: CBService) => void) | undefined
let cbPromise: Promise<CBService> | undefined
let disposables: Atom.CompositeDisposable | undefined

class EditorController {
  private disposed = false
  private layer: Atom.DisplayMarkerLayer
  private disposables = new Atom.CompositeDisposable()

  constructor (private editor: Atom.TextEditor, private cb: CBService) {
    this.layer = this.editor.addMarkerLayer()
    this.disposables.add(this.editor.getBuffer().onDidChangeText(async ({changes}) => {
      const sbs = await this.getSbs()
      for (const {newRange} of changes) {
        this.updateHighlightInRange(sbs, [[newRange.start.row, 0], [newRange.end.row + 1, 0]])
      }
    }))
    this.disposables.add(editor.onDidDestroy(() => {
      this.dispose()
    }))
    this.init()
  }

  public dispose () {
    if (!this.disposed) {
      this.disposed = true
      this.layer.destroy()
      this.disposables.dispose()
    }
  }

  private async init () {
    this.updateHighlightInRange(await this.getSbs(), this.editor.getBuffer().getRange())
  }

  private async updateHighlightInRange (sbs: Set<string>, searchRange: Atom.IRange) {
    for (const marker of this.layer.findMarkers({intersectsRange: searchRange})) {
      marker.destroy()
    }
    this.editor.scanInBufferRange(rx.identRx, searchRange, async ({matchText, range}) => {
      if (sbs.has(matchText)) {
        this.decorateRange(range, selectors)
      }
    })
    this.editor.scanInBufferRange(rx.operatorRx, searchRange, async ({match, range}) => {
      if (sbs.has(`${match[1] || ''}(${match[2] || match[3]})`)) {
        this.decorateRange(range, operatorSelectors)
      }
    })
  }

  private async getSbs () {
    const symbols = await this.cb.getCompletionsForSymbol(this.editor.getBuffer(), '', Atom.Point.fromObject([0, 0]))
    return new Set(symbols.map(({qname}) => qname))
  }

  private async decorateRange (range: Atom.Range, myselectors: string[]) {
    const inScope =
      this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()
      .some((sel) => myselectors.includes(sel))
    if (inScope) {
      const marker = this.layer.markBufferRange(range, {invalidate: 'never'})
      this.editor.decorateMarker(marker, {type: 'text', class: knownIdentClass})
    }
  }
}

export function activate () {
  resolveCB = undefined
  const bprom = cbPromise = new Promise((resolve) => resolveCB = resolve)
  const bdisp = disposables = new Atom.CompositeDisposable()
  disposables.add(atom.workspace.observeTextEditors(async (ed) => {
    if (! activationScopes.includes(ed.getGrammar().scopeName)) { return }
    bdisp.add(new EditorController(ed, await bprom))
  }))
}

export function deactivate () {
  resolveCB = undefined
  cbPromise = undefined
  disposables && disposables.dispose()
  disposables = undefined
}

export function consumeCompBack (service: CBService) {
  resolveCB && resolveCB(service)
}
