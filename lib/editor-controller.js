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
    'entity.name.tag.haskell',
];
const operatorSelectors = [
    'keyword.operator.haskell',
    'entity.name.function.infix.haskell',
];
const activationScopes = [
    'source.haskell',
    'text.tex.latex.haskell',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWRpdG9yLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1Qiw4QkFBNkI7QUFFN0IsTUFBTSxTQUFTLEdBQUc7SUFDaEIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQix5QkFBeUI7Q0FDMUIsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMEJBQTBCO0lBQzFCLG9DQUFvQztDQUNyQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixnQkFBZ0I7SUFDaEIsd0JBQXdCO0NBQ3pCLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQTtBQUVsRDtJQUtFLFlBQW9CLE1BQXVCLEVBQVUsRUFBYTtRQUE5QyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVc7UUFKMUQsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVoQixnQkFBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFHbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQU8sRUFBRSxPQUFPLEVBQUU7WUFDN0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDbkMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENB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TyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU07aUJBQzFCLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUU7aUJBQzlELE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDN0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQzlFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtnQkFDbkYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQTtZQUM5RSxDQUFDO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFsRUQsNENBa0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgcnggZnJvbSAnLi9yZWdleCdcblxuY29uc3Qgc2VsZWN0b3JzID0gW1xuICAnaWRlbnRpZmllci5oYXNrZWxsJyxcbiAgJ2VudGl0eS5uYW1lLnR5cGUuaGFza2VsbCcsXG4gICdlbnRpdHkubmFtZS50YWcuaGFza2VsbCcsXG5dXG5cbmNvbnN0IG9wZXJhdG9yU2VsZWN0b3JzID0gW1xuICAna2V5d29yZC5vcGVyYXRvci5oYXNrZWxsJyxcbiAgJ2VudGl0eS5uYW1lLmZ1bmN0aW9uLmluZml4Lmhhc2tlbGwnLFxuXVxuXG5jb25zdCBhY3RpdmF0aW9uU2NvcGVzID0gW1xuICAnc291cmNlLmhhc2tlbGwnLFxuICAndGV4dC50ZXgubGF0ZXguaGFza2VsbCcsXG5dXG5cbmNvbnN0IGtub3duSWRlbnRDbGFzcyA9ICdzeW50YXgtLWtub3duLWlkZW50aWZpZXInXG5cbmV4cG9ydCBjbGFzcyBFZGl0b3JDb250cm9sbGVyIHtcbiAgcHJpdmF0ZSBkaXNwb3NlZCA9IGZhbHNlXG4gIHByaXZhdGUgbGF5ZXI6IEF0b20uRGlzcGxheU1hcmtlckxheWVyXG4gIHByaXZhdGUgZGlzcG9zYWJsZXMgPSBuZXcgQXRvbS5Db21wb3NpdGVEaXNwb3NhYmxlKClcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCBwcml2YXRlIGNiOiBDQlNlcnZpY2UpIHtcbiAgICB0aGlzLmxheWVyID0gdGhpcy5lZGl0b3IuYWRkTWFya2VyTGF5ZXIoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlVGV4dChhc3luYyAoeyBjaGFuZ2VzIH0pID0+IHtcbiAgICAgIGNvbnN0IHNicyA9IGF3YWl0IHRoaXMuZ2V0U3ltYm9scygpXG4gICAgICBmb3IgKGNvbnN0IHsgbmV3UmFuZ2UgfSBvZiBjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSGlnaGxpZ2h0SW5SYW5nZShzYnMsIFtbbmV3UmFuZ2Uuc3RhcnQucm93LCAwXSwgW25ld1JhbmdlLmVuZC5yb3cgKyAxLCAwXV0pXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgIH0pKVxuICAgIHRoaXMuaW5pdCgpXG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHNob3VsZEFjdGl2YXRlKGVkOiBBdG9tLlRleHRFZGl0b3IpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYWN0aXZhdGlvblNjb3Blcy5pbmNsdWRlcyhlZC5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKVxuICB9XG5cbiAgcHVibGljIGRpc3Bvc2UoKSB7XG4gICAgaWYgKCF0aGlzLmRpc3Bvc2VkKSB7XG4gICAgICB0aGlzLmRpc3Bvc2VkID0gdHJ1ZVxuICAgICAgdGhpcy5sYXllci5kZXN0cm95KClcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0KCkge1xuICAgIHRoaXMudXBkYXRlSGlnaGxpZ2h0SW5SYW5nZShhd2FpdCB0aGlzLmdldFN5bWJvbHMoKSwgdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UmFuZ2UoKSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlSGlnaGxpZ2h0SW5SYW5nZShzYnM6IFNldDxzdHJpbmc+LCBzZWFyY2hSYW5nZTogQXRvbS5JUmFuZ2UpIHtcbiAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLmxheWVyLmZpbmRNYXJrZXJzKHsgaW50ZXJzZWN0c1JhbmdlOiBzZWFyY2hSYW5nZSB9KSkge1xuICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgIH1cbiAgICB0aGlzLmVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShyeC5pZGVudFJ4LCBzZWFyY2hSYW5nZSwgYXN5bmMgKHsgbWF0Y2hUZXh0LCByYW5nZSB9KSA9PiB7XG4gICAgICBpZiAoc2JzLmhhcyhtYXRjaFRleHQpKSB7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVSYW5nZShyYW5nZSwgc2VsZWN0b3JzKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5lZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2Uocngub3BlcmF0b3JSeCwgc2VhcmNoUmFuZ2UsIGFzeW5jICh7IG1hdGNoVGV4dCwgcmFuZ2UgfSkgPT4ge1xuICAgICAgaWYgKHNicy5oYXMobWF0Y2hUZXh0KSkge1xuICAgICAgICB0aGlzLmRlY29yYXRlUmFuZ2UocmFuZ2UsIG9wZXJhdG9yU2VsZWN0b3JzKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGdldFN5bWJvbHMoKSB7XG4gICAgY29uc3Qgc3ltYm9scyA9IGF3YWl0IHRoaXMuY2IuZ2V0Q29tcGxldGlvbnNGb3JTeW1ib2wodGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCksICcnLCBBdG9tLlBvaW50LmZyb21PYmplY3QoWzAsIDBdKSlcbiAgICByZXR1cm4gbmV3IFNldChzeW1ib2xzLm1hcCgoeyBxbmFtZSB9KSA9PiBxbmFtZSkpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRlY29yYXRlUmFuZ2UocmFuZ2U6IEF0b20uUmFuZ2UsIG15c2VsZWN0b3JzOiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IFtpblNjb3BlXSA9IHRoaXMuZWRpdG9yXG4gICAgICAuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24ocmFuZ2Uuc3RhcnQpLmdldFNjb3Blc0FycmF5KClcbiAgICAgIC5maWx0ZXIoKHNlbCkgPT4gbXlzZWxlY3RvcnMuaW5jbHVkZXMoc2VsKSlcbiAgICBpZiAoaW5TY29wZSkge1xuICAgICAgY29uc3Qgc3JhbmdlID0gdGhpcy5lZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oaW5TY29wZSwgcmFuZ2Uuc3RhcnQpXG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmxheWVyLm1hcmtCdWZmZXJSYW5nZShzcmFuZ2UgfHwgcmFuZ2UsIHsgaW52YWxpZGF0ZTogJ25ldmVyJyB9KVxuICAgICAgdGhpcy5lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7IHR5cGU6ICd0ZXh0JywgY2xhc3M6IGtub3duSWRlbnRDbGFzcyB9KVxuICAgIH1cbiAgfVxufVxuIl19