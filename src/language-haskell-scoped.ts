import * as Atom from 'atom'
import {EditorController} from './editor-controller'

let resolveCB: ((val: CBService) => void) | undefined
let cbPromise: Promise<CBService> | undefined
let disposables: Atom.CompositeDisposable | undefined

export function activate () {
  resolveCB = undefined
  const bprom = cbPromise = new Promise((resolve) => resolveCB = resolve)
  const bdisp = disposables = new Atom.CompositeDisposable()
  disposables.add(atom.workspace.observeTextEditors(async (ed) => {
    if (EditorController.shouldActivate(ed)) {
      bdisp.add(new EditorController(ed, await bprom))
    }
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
