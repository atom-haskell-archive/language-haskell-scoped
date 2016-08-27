module.exports = SemanticHighlight =
  activate: ->
    {CompositeDisposable, Disposable} = require 'atom'
    @resolveCB = null
    @CBPromise = new Promise (resolve) => @resolveCB = resolve
    @disposables = new CompositeDisposable
    @disposables.add atom.workspace.observeTextEditors (ed) =>
      @CBPromise.then (cb) =>
        hlcd = null
        highlight = ->
          hlcd?.dispose?()
          hlcd = new CompositeDisposable
          cb.getCompletionsForSymbol(ed.getBuffer(), '')
          .then (symbols) ->
            sbs = new Set(symbols.map ({qname}) -> qname ? name)
            ev = atom.views.getView(ed)
            hl = ->
              [].slice.call(ev.rootElement.querySelectorAll('.identifier.haskell,.type.haskell,.tag.haskell'))
              .forEach (idel) ->
                if sbs.has(idel.innerText)
                  idel.classList.add 'known-identifier'
            # hlcd.add ev.onDidChangeScrollLeft -> hl()
            # hlcd.add ev.onDidChangeScrollTop -> hl()
            ul = ev.component.updateSync
            ev.component.updateSync = ->
              res = ul.apply(this, arguments)
              hl()
              # console.error "1"
              return res
            hlcd.add new Disposable ->
              ev.component.updateSync = ul
            hl()
        @disposables.add ed.onDidStopChanging -> highlight()
        @disposables.add cb.registerCompletionBuffer ed.getBuffer()
        highlight()

  deactivate: ->
    @resolveCB = null
    @CBPromise = null
    @disposables.dispose()
    @disposables = null

  consumeCompBack: (service) ->
    @resolveCB service
