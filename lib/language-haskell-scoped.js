'use babel'
import {CompositeDisposable, Disposable} from 'atom'

const selectors = [
  '.syntax--identifier.syntax--haskell',
  '.syntax--entity.syntax--name.syntax--type.syntax--haskell',
  '.syntax--entity.syntax--name.syntax--tag.syntax--haskell'
]

const activationScopes = [
  'source.haskell',
  'text.tex.latex.haskell'
]

let resolveCB, CBPromise, disposables
let isActive = false

export function activate() {
  isActive = true
  resolveCB = null
  CBPromise = new Promise((resolve) => resolveCB = resolve)
  disposables = new CompositeDisposable()
  disposables.add(atom.workspace.observeTextEditors(async (ed) => {
    if (! activationScopes.includes(ed.getGrammar().scopeName)) { return }
    const cb = await CBPromise
    highlight = async () => {
      const symbols = await cb.getCompletionsForSymbol(ed.getBuffer(), '')
      const sbs = new Set(symbols.map(({qname}) => qname || name))
      const ev = atom.views.getView(ed)
      if ( !(ev && ev.component)) { return }
      const hl = async () => {
        while (isActive) {
          for (const idel of ev.querySelectorAll(selectors.join(','))) {
            if (sbs.has(idel.innerText)) {
              idel.classList.add('syntax--known-identifier')
            }
          }
          await ev.component.getNextUpdatePromise()
        }
      }
      hl()
    }
    disposables.add(ed.onDidStopChanging(() => highlight()))
    disposables.add(cb.registerCompletionBuffer(ed.getBuffer()))
    highlight()
  }))
}

export function deactivate() {
  isActive = false
  resolveCB = null
  CBPromise = null
  disposables.dispose()
  disposables = null
}

export function consumeCompBack(service) {
  resolveCB(service)
}
