/* @flow */
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

interface CBService {
  getCompletionsForSymbol(buffer: Atom.TextBuffer, prefix: string): {
    qname: string
  }[];
}

let resolveCB: ?((val: CBService) => void)
  , CBPromise: ?Promise<CBService>
  , disposables: ?Atom.CompositeDisposable

class EditorController {
  disposed = false
  editor: Atom.TextEditor
  layer: Atom.DisplayMarkerLayer
  disposables = new Atom.CompositeDisposable()
  cb: CBService

  constructor(editor, cb) {
    this.disposed = false
    this.editor = editor
    this.layer = editor.addMarkerLayer()
    this.cb = cb
    this.disposables.add(editor.getBuffer().onDidChangeText(async ({changes}) => {
      const sbs = await this.getSbs()
      for (const {newRange} of changes) {
        this.updateHighlightInRange(sbs, [[newRange.start.row, 0], [newRange.end.row+1, 0]])
      }
    }))
    this.disposables.add(editor.onDidDestroy(() => {
      this.dispose()
    }))
    this.init()
  }

  async init() {
    this.updateHighlightInRange(await this.getSbs(), this.editor.getBuffer().getRange())
  }

  dispose() {
    if (!this.disposed) {
      this.disposed = true
      this.layer.destroy()
      this.disposables.dispose()
    }
  }

  async updateHighlightInRange(sbs, searchRange) {
    for (const marker of this.layer.findMarkers({'intersectsRange': searchRange})) {
      marker.destroy()
    }
    this.editor.scanInBufferRange(rx.identifier, searchRange, async ({matchText, range}) => {
      if (sbs.has(matchText)) {
        this.decorateRange(range, selectors)
      }
    })
    this.editor.scanInBufferRange(rx.operator, searchRange, async ({match, range}) => {
      if (sbs.has(`${match[1] || ''}(${match[2] || match[3]})`)) {
        this.decorateRange(range, operatorSelectors)
      }
    })
  }

  async getSbs() {
    const symbols = await this.cb.getCompletionsForSymbol(this.editor.getBuffer(), '')
    return new Set(symbols.map(({qname}) => qname))
  }

  async decorateRange(range: Atom.Range, selectors: string[]) {
    const inScope =
      this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()
      .some((sel) => selectors.includes(sel))
    if (inScope) {
      const marker = this.layer.markBufferRange(range, {invalidate: 'never'})
      this.editor.decorateMarker(marker, {type: 'text', class: knownIdentClass})
    }
  }
}

export function activate() {
  resolveCB = null
  const bprom = CBPromise = new Promise((resolve) => resolveCB = resolve)
  const bdisp = disposables = new Atom.CompositeDisposable()
  disposables.add(atom.workspace.observeTextEditors(async (ed) => {
    if (! activationScopes.includes(ed.getGrammar().scopeName)) { return }
    bdisp.add(new EditorController(ed, await bprom))
  }))
}

export function deactivate() {
  resolveCB = null
  CBPromise = null
  disposables && disposables.dispose()
  disposables = null
}

export function consumeCompBack(service: CBService) {
  resolveCB && resolveCB(service)
}
