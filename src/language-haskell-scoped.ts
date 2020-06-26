import * as Atom from 'atom'
import { EditorController } from './editor-controller'
import { ICompletionBackend } from 'atom-haskell-upi/completion-backend'

let resolveCB: ((val: ICompletionBackend) => void) | undefined
let disposables: Atom.CompositeDisposable | undefined

export function activate() {
  resolveCB = undefined
  const bprom = new Promise<ICompletionBackend>(
    (resolve) => (resolveCB = resolve),
  )
  const bdisp = (disposables = new Atom.CompositeDisposable())
  disposables.add(
    atom.workspace.observeTextEditors(async (ed) => {
      if (EditorController.shouldActivate(ed)) {
        bdisp.add(new EditorController(ed, await bprom))
      }
    }),
  )
}

export function deactivate() {
  resolveCB = undefined
  disposables && disposables.dispose()
  disposables = undefined
}

export function consumeCompBack(service: ICompletionBackend) {
  resolveCB && resolveCB(service)
}
