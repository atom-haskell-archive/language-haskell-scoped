"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Atom = require("atom");
const rx = require("./regex");
const selectors = [
    'identifier.haskell',
    'entity.name.type.haskell',
    'entity.name.tag.haskell'
];
const operatorSelectors = [
    'keyword.operator.haskell',
    'entity.name.function.infix.haskell'
];
const activationScopes = [
    'source.haskell',
    'text.tex.latex.haskell'
];
const knownIdentClass = 'syntax--known-identifier';
let resolveCB;
let cbPromise;
let disposables;
class EditorController {
    constructor(editor, cb) {
        this.editor = editor;
        this.cb = cb;
        this.disposed = false;
        this.disposables = new Atom.CompositeDisposable();
        this.layer = this.editor.addMarkerLayer();
        this.disposables.add(this.editor.getBuffer().onDidChangeText(({ changes }) => __awaiter(this, void 0, void 0, function* () {
            const sbs = yield this.getSbs();
            for (const { newRange } of changes) {
                this.updateHighlightInRange(sbs, [[newRange.start.row, 0], [newRange.end.row + 1, 0]]);
            }
        })));
        this.disposables.add(editor.onDidDestroy(() => {
            this.dispose();
        }));
        this.init();
    }
    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.layer.destroy();
            this.disposables.dispose();
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateHighlightInRange(yield this.getSbs(), this.editor.getBuffer().getRange());
        });
    }
    updateHighlightInRange(sbs, searchRange) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const marker of this.layer.findMarkers({ intersectsRange: searchRange })) {
                marker.destroy();
            }
            this.editor.scanInBufferRange(rx.identRx, searchRange, ({ matchText, range }) => __awaiter(this, void 0, void 0, function* () {
                if (sbs.has(matchText)) {
                    this.decorateRange(range, selectors);
                }
            }));
            this.editor.scanInBufferRange(rx.operatorRx, searchRange, ({ match, range }) => __awaiter(this, void 0, void 0, function* () {
                if (sbs.has(`${match[1] || ''}(${match[2] || match[3]})`)) {
                    this.decorateRange(range, operatorSelectors);
                }
            }));
        });
    }
    getSbs() {
        return __awaiter(this, void 0, void 0, function* () {
            const symbols = yield this.cb.getCompletionsForSymbol(this.editor.getBuffer(), '', Atom.Point.fromObject([0, 0]));
            return new Set(symbols.map(({ qname }) => qname));
        });
    }
    decorateRange(range, myselectors) {
        return __awaiter(this, void 0, void 0, function* () {
            const inScope = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()
                .some((sel) => myselectors.includes(sel));
            if (inScope) {
                const marker = this.layer.markBufferRange(range, { invalidate: 'never' });
                this.editor.decorateMarker(marker, { type: 'text', class: knownIdentClass });
            }
        });
    }
}
function activate() {
    resolveCB = undefined;
    const bprom = cbPromise = new Promise((resolve) => resolveCB = resolve);
    const bdisp = disposables = new Atom.CompositeDisposable();
    disposables.add(atom.workspace.observeTextEditors((ed) => __awaiter(this, void 0, void 0, function* () {
        if (!activationScopes.includes(ed.getGrammar().scopeName)) {
            return;
        }
        bdisp.add(new EditorController(ed, yield bprom));
    })));
}
exports.activate = activate;
function deactivate() {
    resolveCB = undefined;
    cbPromise = undefined;
    disposables && disposables.dispose();
    disposables = undefined;
}
exports.deactivate = deactivate;
function consumeCompBack(service) {
    resolveCB && resolveCB(service);
}
exports.consumeCompBack = consumeCompBack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UtaGFza2VsbC1zY29wZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGFuZ3VhZ2UtaGFza2VsbC1zY29wZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1Qiw4QkFBNkI7QUFFN0IsTUFBTSxTQUFTLEdBQUc7SUFDaEIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQix5QkFBeUI7Q0FDMUIsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMEJBQTBCO0lBQzFCLG9DQUFvQztDQUNyQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixnQkFBZ0I7SUFDaEIsd0JBQXdCO0NBQ3pCLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQTtBQUdsRCxJQUFJLFNBQWlELENBQUE7QUFDckQsSUFBSSxTQUF5QyxDQUFBO0FBQzdDLElBQUksV0FBaUQsQ0FBQTtBQUVyRDtJQUtFLFlBQXFCLE1BQXVCLEVBQVUsRUFBYTtRQUE5QyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVc7UUFKM0QsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVoQixnQkFBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFHbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQU8sRUFBQyxPQUFPLEVBQUM7WUFDM0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7WUFDL0IsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JB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QTtJQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBUkQsNEJBUUM7QUFFRDtJQUNFLFNBQVMsR0FBRyxTQUFTLENBQUE7SUFDckIsU0FBUyxHQUFHLFNBQVMsQ0FBQTtJQUNyQixXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3BDLFdBQVcsR0FBRyxTQUFTLENBQUE7QUFDekIsQ0FBQztBQUxELGdDQUtDO0FBRUQseUJBQWlDLE9BQWtCO0lBQ2pELFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakMsQ0FBQztBQUZELDBDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgcnggZnJvbSAnLi9yZWdleCdcblxuY29uc3Qgc2VsZWN0b3JzID0gW1xuICAnaWRlbnRpZmllci5oYXNrZWxsJyxcbiAgJ2VudGl0eS5uYW1lLnR5cGUuaGFza2VsbCcsXG4gICdlbnRpdHkubmFtZS50YWcuaGFza2VsbCdcbl1cblxuY29uc3Qgb3BlcmF0b3JTZWxlY3RvcnMgPSBbXG4gICdrZXl3b3JkLm9wZXJhdG9yLmhhc2tlbGwnLFxuICAnZW50aXR5Lm5hbWUuZnVuY3Rpb24uaW5maXguaGFza2VsbCdcbl1cblxuY29uc3QgYWN0aXZhdGlvblNjb3BlcyA9IFtcbiAgJ3NvdXJjZS5oYXNrZWxsJyxcbiAgJ3RleHQudGV4LmxhdGV4Lmhhc2tlbGwnXG5dXG5cbmNvbnN0IGtub3duSWRlbnRDbGFzcyA9ICdzeW50YXgtLWtub3duLWlkZW50aWZpZXInXG5cbnR5cGUgQ0JTZXJ2aWNlID0gVVBJLkNvbXBsZXRpb25CYWNrZW5kLklDb21wbGV0aW9uQmFja2VuZFxubGV0IHJlc29sdmVDQjogKCh2YWw6IENCU2VydmljZSkgPT4gdm9pZCkgfCB1bmRlZmluZWRcbmxldCBjYlByb21pc2U6IFByb21pc2U8Q0JTZXJ2aWNlPiB8IHVuZGVmaW5lZFxubGV0IGRpc3Bvc2FibGVzOiBBdG9tLkNvbXBvc2l0ZURpc3Bvc2FibGUgfCB1bmRlZmluZWRcblxuY2xhc3MgRWRpdG9yQ29udHJvbGxlciB7XG4gIHByaXZhdGUgZGlzcG9zZWQgPSBmYWxzZVxuICBwcml2YXRlIGxheWVyOiBBdG9tLkRpc3BsYXlNYXJrZXJMYXllclxuICBwcml2YXRlIGRpc3Bvc2FibGVzID0gbmV3IEF0b20uQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgY29uc3RydWN0b3IgKHByaXZhdGUgZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIHByaXZhdGUgY2I6IENCU2VydmljZSkge1xuICAgIHRoaXMubGF5ZXIgPSB0aGlzLmVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2VUZXh0KGFzeW5jICh7Y2hhbmdlc30pID0+IHtcbiAgICAgIGNvbnN0IHNicyA9IGF3YWl0IHRoaXMuZ2V0U2JzKClcbiAgICAgIGZvciAoY29uc3Qge25ld1JhbmdlfSBvZiBjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSGlnaGxpZ2h0SW5SYW5nZShzYnMsIFtbbmV3UmFuZ2Uuc3RhcnQucm93LCAwXSwgW25ld1JhbmdlLmVuZC5yb3cgKyAxLCAwXV0pXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgIH0pKVxuICAgIHRoaXMuaW5pdCgpXG4gIH1cblxuICBwdWJsaWMgZGlzcG9zZSAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc3Bvc2VkKSB7XG4gICAgICB0aGlzLmRpc3Bvc2VkID0gdHJ1ZVxuICAgICAgdGhpcy5sYXllci5kZXN0cm95KClcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0ICgpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZ2hsaWdodEluUmFuZ2UoYXdhaXQgdGhpcy5nZXRTYnMoKSwgdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UmFuZ2UoKSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlSGlnaGxpZ2h0SW5SYW5nZSAoc2JzOiBTZXQ8c3RyaW5nPiwgc2VhcmNoUmFuZ2U6IEF0b20uSVJhbmdlKSB7XG4gICAgZm9yIChjb25zdCBtYXJrZXIgb2YgdGhpcy5sYXllci5maW5kTWFya2Vycyh7aW50ZXJzZWN0c1JhbmdlOiBzZWFyY2hSYW5nZX0pKSB7XG4gICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMuZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlKHJ4LmlkZW50UngsIHNlYXJjaFJhbmdlLCBhc3luYyAoe21hdGNoVGV4dCwgcmFuZ2V9KSA9PiB7XG4gICAgICBpZiAoc2JzLmhhcyhtYXRjaFRleHQpKSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVSYW5nZShyYW5nZSwgc2VsZWN0b3JzKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2Uocngub3BlcmF0b3JSeCwgc2VhcmNoUmFuZ2UsIGFzeW5jICh7bWF0Y2gsIHJhbmdlfSkgPT4ge1xuICAgICAgaWYgKHNicy5oYXMoYCR7bWF0Y2hbMV0gfHwgJyd9KCR7bWF0Y2hbMl0gfHwgbWF0Y2hbM119KWApKSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVSYW5nZShyYW5nZSwgb3BlcmF0b3JTZWxlY3RvcnMpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0U2JzICgpIHtcbiAgICBjb25zdCBzeW1ib2xzID0gYXdhaXQgdGhpcy5jYi5nZXRDb21wbGV0aW9uc0ZvclN5bWJvbCh0aGlzLmVkaXRvci5nZXRCdWZmZXIoKSwgJycsIEF0b20uUG9pbnQuZnJvbU9iamVjdChbMCwgMF0pKVxuICAgIHJldHVybiBuZXcgU2V0KHN5bWJvbHMubWFwKCh7cW5hbWV9KSA9PiBxbmFtZSkpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlY29yYXRlUmFuZ2UgKHJhbmdlOiBBdG9tLlJhbmdlLCBteXNlbGVjdG9yczogc3RyaW5nW10pIHtcbiAgICBjb25zdCBpblNjb3BlID1cbiAgICAgIHRoaXMuZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlLnN0YXJ0KS5nZXRTY29wZXNBcnJheSgpXG4gICAgICAuc29tZSgoc2VsKSA9PiBteXNlbGVjdG9ycy5pbmNsdWRlcyhzZWwpKVxuICAgIGlmIChpblNjb3BlKSB7XG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmxheWVyLm1hcmtCdWZmZXJSYW5nZShyYW5nZSwge2ludmFsaWRhdGU6ICduZXZlcid9KVxuICAgICAgdGhpcy5lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ3RleHQnLCBjbGFzczoga25vd25JZGVudENsYXNzfSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlICgpIHtcbiAgcmVzb2x2ZUNCID0gdW5kZWZpbmVkXG4gIGNvbnN0IGJwcm9tID0gY2JQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHJlc29sdmVDQiA9IHJlc29sdmUpXG4gIGNvbnN0IGJkaXNwID0gZGlzcG9zYWJsZXMgPSBuZXcgQXRvbS5Db21wb3NpdGVEaXNwb3NhYmxlKClcbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhhc3luYyAoZWQpID0+IHtcbiAgICBpZiAoISBhY3RpdmF0aW9uU2NvcGVzLmluY2x1ZGVzKGVkLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpKSB7IHJldHVybiB9XG4gICAgYmRpc3AuYWRkKG5ldyBFZGl0b3JDb250cm9sbGVyKGVkLCBhd2FpdCBicHJvbSkpXG4gIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIHJlc29sdmVDQiA9IHVuZGVmaW5lZFxuICBjYlByb21pc2UgPSB1bmRlZmluZWRcbiAgZGlzcG9zYWJsZXMgJiYgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIGRpc3Bvc2FibGVzID0gdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lQ29tcEJhY2sgKHNlcnZpY2U6IENCU2VydmljZSkge1xuICByZXNvbHZlQ0IgJiYgcmVzb2x2ZUNCKHNlcnZpY2UpXG59XG4iXX0=