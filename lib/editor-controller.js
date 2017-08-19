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
class EditorController {
    constructor(editor, cb) {
        this.editor = editor;
        this.cb = cb;
        this.disposed = false;
        this.disposables = new Atom.CompositeDisposable();
        this.layer = this.editor.addMarkerLayer();
        this.disposables.add(this.editor.getBuffer().onDidChangeText(({ changes }) => __awaiter(this, void 0, void 0, function* () {
            const sbs = yield this.getSymbols();
            for (const { newRange } of changes) {
                this.updateHighlightInRange(sbs, [[newRange.start.row, 0], [newRange.end.row + 1, 0]]);
            }
        })));
        this.disposables.add(editor.onDidDestroy(() => {
            this.dispose();
        }));
        this.init();
    }
    static shouldActivate(ed) {
        return activationScopes.includes(ed.getGrammar().scopeName);
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
            this.updateHighlightInRange(yield this.getSymbols(), this.editor.getBuffer().getRange());
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
            this.editor.scanInBufferRange(rx.operatorRx, searchRange, ({ matchText, range }) => __awaiter(this, void 0, void 0, function* () {
                if (sbs.has(matchText)) {
                    this.decorateRange(range, operatorSelectors);
                }
            }));
        });
    }
    getSymbols() {
        return __awaiter(this, void 0, void 0, function* () {
            const symbols = yield this.cb.getCompletionsForSymbol(this.editor.getBuffer(), '', Atom.Point.fromObject([0, 0]));
            return new Set(symbols.map(({ qname }) => qname));
        });
    }
    decorateRange(range, myselectors) {
        return __awaiter(this, void 0, void 0, function* () {
            const [inScope] = this.editor
                .scopeDescriptorForBufferPosition(range.start).getScopesArray()
                .filter((sel) => myselectors.includes(sel));
            if (inScope) {
                const srange = this.editor.bufferRangeForScopeAtPosition(inScope, range.start);
                const marker = this.layer.markBufferRange(srange || range, { invalidate: 'never' });
                this.editor.decorateMarker(marker, { type: 'text', class: knownIdentClass });
            }
        });
    }
}
exports.EditorController = EditorController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWRpdG9yLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1Qiw4QkFBNkI7QUFFN0IsTUFBTSxTQUFTLEdBQUc7SUFDaEIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQix5QkFBeUI7Q0FDMUIsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMEJBQTBCO0lBQzFCLG9DQUFvQztDQUNyQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixnQkFBZ0I7SUFDaEIsd0JBQXdCO0NBQ3pCLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQTtBQUVsRDtJQVNFLFlBQXFCLE1BQXVCLEVBQVUsRUFBYTtRQUE5QyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVc7UUFKM0QsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVoQixnQkFBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFHbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQU8sRUFBQyxPQUFPLEVBQUM7WUFDM0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDbkMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENB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QUFPLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTTtpQkFDMUIsZ0NBQWdDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRTtpQkFDOUQsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDOUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO2dCQUNqRixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFBO1lBQzVFLENBQUM7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQWxFRCw0Q0FrRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdG9tIGZyb20gJ2F0b20nXG5pbXBvcnQgKiBhcyByeCBmcm9tICcuL3JlZ2V4J1xuXG5jb25zdCBzZWxlY3RvcnMgPSBbXG4gICdpZGVudGlmaWVyLmhhc2tlbGwnLFxuICAnZW50aXR5Lm5hbWUudHlwZS5oYXNrZWxsJyxcbiAgJ2VudGl0eS5uYW1lLnRhZy5oYXNrZWxsJ1xuXVxuXG5jb25zdCBvcGVyYXRvclNlbGVjdG9ycyA9IFtcbiAgJ2tleXdvcmQub3BlcmF0b3IuaGFza2VsbCcsXG4gICdlbnRpdHkubmFtZS5mdW5jdGlvbi5pbmZpeC5oYXNrZWxsJ1xuXVxuXG5jb25zdCBhY3RpdmF0aW9uU2NvcGVzID0gW1xuICAnc291cmNlLmhhc2tlbGwnLFxuICAndGV4dC50ZXgubGF0ZXguaGFza2VsbCdcbl1cblxuY29uc3Qga25vd25JZGVudENsYXNzID0gJ3N5bnRheC0ta25vd24taWRlbnRpZmllcidcblxuZXhwb3J0IGNsYXNzIEVkaXRvckNvbnRyb2xsZXIge1xuICBwdWJsaWMgc3RhdGljIHNob3VsZEFjdGl2YXRlIChlZDogQXRvbS5UZXh0RWRpdG9yKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGFjdGl2YXRpb25TY29wZXMuaW5jbHVkZXMoZWQuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSlcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZWQgPSBmYWxzZVxuICBwcml2YXRlIGxheWVyOiBBdG9tLkRpc3BsYXlNYXJrZXJMYXllclxuICBwcml2YXRlIGRpc3Bvc2FibGVzID0gbmV3IEF0b20uQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgY29uc3RydWN0b3IgKHByaXZhdGUgZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIHByaXZhdGUgY2I6IENCU2VydmljZSkge1xuICAgIHRoaXMubGF5ZXIgPSB0aGlzLmVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2VUZXh0KGFzeW5jICh7Y2hhbmdlc30pID0+IHtcbiAgICAgIGNvbnN0IHNicyA9IGF3YWl0IHRoaXMuZ2V0U3ltYm9scygpXG4gICAgICBmb3IgKGNvbnN0IHtuZXdSYW5nZX0gb2YgY2hhbmdlcykge1xuICAgICAgICB0aGlzLnVwZGF0ZUhpZ2hsaWdodEluUmFuZ2Uoc2JzLCBbW25ld1JhbmdlLnN0YXJ0LnJvdywgMF0sIFtuZXdSYW5nZS5lbmQucm93ICsgMSwgMF1dKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICB9KSlcbiAgICB0aGlzLmluaXQoKVxuICB9XG5cbiAgcHVibGljIGRpc3Bvc2UgKCkge1xuICAgIGlmICghdGhpcy5kaXNwb3NlZCkge1xuICAgICAgdGhpcy5kaXNwb3NlZCA9IHRydWVcbiAgICAgIHRoaXMubGF5ZXIuZGVzdHJveSgpXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdCAoKSB7XG4gICAgdGhpcy51cGRhdGVIaWdobGlnaHRJblJhbmdlKGF3YWl0IHRoaXMuZ2V0U3ltYm9scygpLCB0aGlzLmVkaXRvci5nZXRCdWZmZXIoKS5nZXRSYW5nZSgpKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVIaWdobGlnaHRJblJhbmdlIChzYnM6IFNldDxzdHJpbmc+LCBzZWFyY2hSYW5nZTogQXRvbS5JUmFuZ2UpIHtcbiAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLmxheWVyLmZpbmRNYXJrZXJzKHtpbnRlcnNlY3RzUmFuZ2U6IHNlYXJjaFJhbmdlfSkpIHtcbiAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UocnguaWRlbnRSeCwgc2VhcmNoUmFuZ2UsIGFzeW5jICh7bWF0Y2hUZXh0LCByYW5nZX0pID0+IHtcbiAgICAgIGlmIChzYnMuaGFzKG1hdGNoVGV4dCkpIHtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZVJhbmdlKHJhbmdlLCBzZWxlY3RvcnMpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShyeC5vcGVyYXRvclJ4LCBzZWFyY2hSYW5nZSwgYXN5bmMgKHttYXRjaFRleHQsIHJhbmdlfSkgPT4ge1xuICAgICAgaWYgKHNicy5oYXMobWF0Y2hUZXh0KSkge1xuICAgICAgICB0aGlzLmRlY29yYXRlUmFuZ2UocmFuZ2UsIG9wZXJhdG9yU2VsZWN0b3JzKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldFN5bWJvbHMgKCkge1xuICAgIGNvbnN0IHN5bWJvbHMgPSBhd2FpdCB0aGlzLmNiLmdldENvbXBsZXRpb25zRm9yU3ltYm9sKHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLCAnJywgQXRvbS5Qb2ludC5mcm9tT2JqZWN0KFswLCAwXSkpXG4gICAgcmV0dXJuIG5ldyBTZXQoc3ltYm9scy5tYXAoKHtxbmFtZX0pID0+IHFuYW1lKSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZGVjb3JhdGVSYW5nZSAocmFuZ2U6IEF0b20uUmFuZ2UsIG15c2VsZWN0b3JzOiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IFtpblNjb3BlXSA9IHRoaXMuZWRpdG9yXG4gICAgICAuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24ocmFuZ2Uuc3RhcnQpLmdldFNjb3Blc0FycmF5KClcbiAgICAgIC5maWx0ZXIoKHNlbCkgPT4gbXlzZWxlY3RvcnMuaW5jbHVkZXMoc2VsKSlcbiAgICBpZiAoaW5TY29wZSkge1xuICAgICAgY29uc3Qgc3JhbmdlID0gdGhpcy5lZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oaW5TY29wZSwgcmFuZ2Uuc3RhcnQpXG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmxheWVyLm1hcmtCdWZmZXJSYW5nZShzcmFuZ2UgfHwgcmFuZ2UsIHtpbnZhbGlkYXRlOiAnbmV2ZXInfSlcbiAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICd0ZXh0JywgY2xhc3M6IGtub3duSWRlbnRDbGFzc30pXG4gICAgfVxuICB9XG59XG4iXX0=