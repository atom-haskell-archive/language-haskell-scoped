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
            this.editor.scanInBufferRange(rx.operatorRx, searchRange, ({ match, range }) => __awaiter(this, void 0, void 0, function* () {
                if (sbs.has(`${match[1] || ''}(${match[2] || match[3]})`)) {
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
            const inScope = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()
                .some((sel) => myselectors.includes(sel));
            if (inScope) {
                const marker = this.layer.markBufferRange(range, { invalidate: 'never' });
                this.editor.decorateMarker(marker, { type: 'text', class: knownIdentClass });
            }
        });
    }
}
exports.EditorController = EditorController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWRpdG9yLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1Qiw4QkFBNkI7QUFFN0IsTUFBTSxTQUFTLEdBQUc7SUFDaEIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQix5QkFBeUI7Q0FDMUIsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMEJBQTBCO0lBQzFCLG9DQUFvQztDQUNyQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixnQkFBZ0I7SUFDaEIsd0JBQXdCO0NBQ3pCLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQTtBQUVsRDtJQVNFLFlBQXFCLE1BQXVCLEVBQVUsRUFBYTtRQUE5QyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVc7UUFKM0QsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVoQixnQkFBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFHbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQU8sRUFBQyxPQUFPLEVBQUM7WUFDM0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDbkMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENB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QUFLLENBQUMsQ0FBQyxDQUFBO1FBQ2pELENBQUM7S0FBQTtJQUVhLGFBQWEsQ0FBRSxLQUFpQixFQUFFLFdBQXFCOztZQUNuRSxNQUFNLE9BQU8sR0FDWCxJQUFJLENBQUMsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUU7aUJBQ3pFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtnQkFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQTtZQUM1RSxDQUFDO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFqRUQsNENBaUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgcnggZnJvbSAnLi9yZWdleCdcblxuY29uc3Qgc2VsZWN0b3JzID0gW1xuICAnaWRlbnRpZmllci5oYXNrZWxsJyxcbiAgJ2VudGl0eS5uYW1lLnR5cGUuaGFza2VsbCcsXG4gICdlbnRpdHkubmFtZS50YWcuaGFza2VsbCdcbl1cblxuY29uc3Qgb3BlcmF0b3JTZWxlY3RvcnMgPSBbXG4gICdrZXl3b3JkLm9wZXJhdG9yLmhhc2tlbGwnLFxuICAnZW50aXR5Lm5hbWUuZnVuY3Rpb24uaW5maXguaGFza2VsbCdcbl1cblxuY29uc3QgYWN0aXZhdGlvblNjb3BlcyA9IFtcbiAgJ3NvdXJjZS5oYXNrZWxsJyxcbiAgJ3RleHQudGV4LmxhdGV4Lmhhc2tlbGwnXG5dXG5cbmNvbnN0IGtub3duSWRlbnRDbGFzcyA9ICdzeW50YXgtLWtub3duLWlkZW50aWZpZXInXG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JDb250cm9sbGVyIHtcbiAgcHVibGljIHN0YXRpYyBzaG91bGRBY3RpdmF0ZSAoZWQ6IEF0b20uVGV4dEVkaXRvcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBhY3RpdmF0aW9uU2NvcGVzLmluY2x1ZGVzKGVkLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpXG4gIH1cblxuICBwcml2YXRlIGRpc3Bvc2VkID0gZmFsc2VcbiAgcHJpdmF0ZSBsYXllcjogQXRvbS5EaXNwbGF5TWFya2VyTGF5ZXJcbiAgcHJpdmF0ZSBkaXNwb3NhYmxlcyA9IG5ldyBBdG9tLkNvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCBwcml2YXRlIGNiOiBDQlNlcnZpY2UpIHtcbiAgICB0aGlzLmxheWVyID0gdGhpcy5lZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlVGV4dChhc3luYyAoe2NoYW5nZXN9KSA9PiB7XG4gICAgICBjb25zdCBzYnMgPSBhd2FpdCB0aGlzLmdldFN5bWJvbHMoKVxuICAgICAgZm9yIChjb25zdCB7bmV3UmFuZ2V9IG9mIGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVIaWdobGlnaHRJblJhbmdlKHNicywgW1tuZXdSYW5nZS5zdGFydC5yb3csIDBdLCBbbmV3UmFuZ2UuZW5kLnJvdyArIDEsIDBdXSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgfSkpXG4gICAgdGhpcy5pbml0KClcbiAgfVxuXG4gIHB1YmxpYyBkaXNwb3NlICgpIHtcbiAgICBpZiAoIXRoaXMuZGlzcG9zZWQpIHtcbiAgICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlXG4gICAgICB0aGlzLmxheWVyLmRlc3Ryb3koKVxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQgKCkge1xuICAgIHRoaXMudXBkYXRlSGlnaGxpZ2h0SW5SYW5nZShhd2FpdCB0aGlzLmdldFN5bWJvbHMoKSwgdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UmFuZ2UoKSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlSGlnaGxpZ2h0SW5SYW5nZSAoc2JzOiBTZXQ8c3RyaW5nPiwgc2VhcmNoUmFuZ2U6IEF0b20uSVJhbmdlKSB7XG4gICAgZm9yIChjb25zdCBtYXJrZXIgb2YgdGhpcy5sYXllci5maW5kTWFya2Vycyh7aW50ZXJzZWN0c1JhbmdlOiBzZWFyY2hSYW5nZX0pKSB7XG4gICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMuZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlKHJ4LmlkZW50UngsIHNlYXJjaFJhbmdlLCBhc3luYyAoe21hdGNoVGV4dCwgcmFuZ2V9KSA9PiB7XG4gICAgICBpZiAoc2JzLmhhcyhtYXRjaFRleHQpKSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVSYW5nZShyYW5nZSwgc2VsZWN0b3JzKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2Uocngub3BlcmF0b3JSeCwgc2VhcmNoUmFuZ2UsIGFzeW5jICh7bWF0Y2gsIHJhbmdlfSkgPT4ge1xuICAgICAgaWYgKHNicy5oYXMoYCR7bWF0Y2hbMV0gfHwgJyd9KCR7bWF0Y2hbMl0gfHwgbWF0Y2hbM119KWApKSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVSYW5nZShyYW5nZSwgb3BlcmF0b3JTZWxlY3RvcnMpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0U3ltYm9scyAoKSB7XG4gICAgY29uc3Qgc3ltYm9scyA9IGF3YWl0IHRoaXMuY2IuZ2V0Q29tcGxldGlvbnNGb3JTeW1ib2wodGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCksICcnLCBBdG9tLlBvaW50LmZyb21PYmplY3QoWzAsIDBdKSlcbiAgICByZXR1cm4gbmV3IFNldChzeW1ib2xzLm1hcCgoe3FuYW1lfSkgPT4gcW5hbWUpKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBkZWNvcmF0ZVJhbmdlIChyYW5nZTogQXRvbS5SYW5nZSwgbXlzZWxlY3RvcnM6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgaW5TY29wZSA9XG4gICAgICB0aGlzLmVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydCkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgLnNvbWUoKHNlbCkgPT4gbXlzZWxlY3RvcnMuaW5jbHVkZXMoc2VsKSlcbiAgICBpZiAoaW5TY29wZSkge1xuICAgICAgY29uc3QgbWFya2VyID0gdGhpcy5sYXllci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UsIHtpbnZhbGlkYXRlOiAnbmV2ZXInfSlcbiAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge3R5cGU6ICd0ZXh0JywgY2xhc3M6IGtub3duSWRlbnRDbGFzc30pXG4gICAgfVxuICB9XG59XG4iXX0=