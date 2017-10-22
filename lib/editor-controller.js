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
                yield this.updateHighlightInRange(sbs, [[newRange.start.row, 0], [newRange.end.row + 1, 0]]);
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
            yield this.updateHighlightInRange(yield this.getSymbols(), this.editor.getBuffer().getRange());
        });
    }
    updateHighlightInRange(sbs, searchRange) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const marker of this.layer.findMarkers({ intersectsRange: searchRange })) {
                marker.destroy();
            }
            this.editor.scanInBufferRange(rx.identRx, searchRange, ({ matchText, range }) => __awaiter(this, void 0, void 0, function* () {
                if (sbs.has(matchText)) {
                    yield this.decorateRange(range, selectors);
                }
            }));
            this.editor.scanInBufferRange(rx.operatorRx, searchRange, ({ matchText, range }) => __awaiter(this, void 0, void 0, function* () {
                if (sbs.has(matchText)) {
                    yield this.decorateRange(range, operatorSelectors);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWRpdG9yLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1Qiw4QkFBNkI7QUFFN0IsTUFBTSxTQUFTLEdBQUc7SUFDaEIsb0JBQW9CO0lBQ3BCLDBCQUEwQjtJQUMxQix5QkFBeUI7Q0FDMUIsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsMEJBQTBCO0lBQzFCLG9DQUFvQztDQUNyQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixnQkFBZ0I7SUFDaEIsd0JBQXdCO0NBQ3pCLENBQUE7QUFFRCxNQUFNLGVBQWUsR0FBRywwQkFBMEIsQ0FBQTtBQUVsRDtJQUtFLFlBQW9CLE1BQXVCLEVBQVUsRUFBYTtRQUE5QyxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVc7UUFKMUQsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQUVoQixnQkFBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFHbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQU8sRUFBRSxPQUFPLEVBQUU7WUFDN0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDbkMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVB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O1lBQ2xFLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTTtpQkFDMUIsZ0NBQWdDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRTtpQkFDOUQsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDOUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO2dCQUNuRixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFBO1lBQzlFLENBQUM7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQW5FRCw0Q0FtRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBdG9tIGZyb20gJ2F0b20nXG5pbXBvcnQgKiBhcyByeCBmcm9tICcuL3JlZ2V4J1xuXG5jb25zdCBzZWxlY3RvcnMgPSBbXG4gICdpZGVudGlmaWVyLmhhc2tlbGwnLFxuICAnZW50aXR5Lm5hbWUudHlwZS5oYXNrZWxsJyxcbiAgJ2VudGl0eS5uYW1lLnRhZy5oYXNrZWxsJyxcbl1cblxuY29uc3Qgb3BlcmF0b3JTZWxlY3RvcnMgPSBbXG4gICdrZXl3b3JkLm9wZXJhdG9yLmhhc2tlbGwnLFxuICAnZW50aXR5Lm5hbWUuZnVuY3Rpb24uaW5maXguaGFza2VsbCcsXG5dXG5cbmNvbnN0IGFjdGl2YXRpb25TY29wZXMgPSBbXG4gICdzb3VyY2UuaGFza2VsbCcsXG4gICd0ZXh0LnRleC5sYXRleC5oYXNrZWxsJyxcbl1cblxuY29uc3Qga25vd25JZGVudENsYXNzID0gJ3N5bnRheC0ta25vd24taWRlbnRpZmllcidcblxuZXhwb3J0IGNsYXNzIEVkaXRvckNvbnRyb2xsZXIge1xuICBwcml2YXRlIGRpc3Bvc2VkID0gZmFsc2VcbiAgcHJpdmF0ZSBsYXllcjogQXRvbS5EaXNwbGF5TWFya2VyTGF5ZXJcbiAgcHJpdmF0ZSBkaXNwb3NhYmxlcyA9IG5ldyBBdG9tLkNvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIHByaXZhdGUgY2I6IENCU2VydmljZSkge1xuICAgIHRoaXMubGF5ZXIgPSB0aGlzLmVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2VUZXh0KGFzeW5jICh7IGNoYW5nZXMgfSkgPT4ge1xuICAgICAgY29uc3Qgc2JzID0gYXdhaXQgdGhpcy5nZXRTeW1ib2xzKClcbiAgICAgIGZvciAoY29uc3QgeyBuZXdSYW5nZSB9IG9mIGNoYW5nZXMpIHtcbiAgICAgICAgYXdhaXQgdGhpcy51cGRhdGVIaWdobGlnaHRJblJhbmdlKHNicywgW1tuZXdSYW5nZS5zdGFydC5yb3csIDBdLCBbbmV3UmFuZ2UuZW5kLnJvdyArIDEsIDBdXSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgfSkpXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWZsb2F0aW5nLXByb21pc2VzXG4gICAgdGhpcy5pbml0KClcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc2hvdWxkQWN0aXZhdGUoZWQ6IEF0b20uVGV4dEVkaXRvcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBhY3RpdmF0aW9uU2NvcGVzLmluY2x1ZGVzKGVkLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpXG4gIH1cblxuICBwdWJsaWMgZGlzcG9zZSgpIHtcbiAgICBpZiAoIXRoaXMuZGlzcG9zZWQpIHtcbiAgICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlXG4gICAgICB0aGlzLmxheWVyLmRlc3Ryb3koKVxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXQoKSB7XG4gICAgYXdhaXQgdGhpcy51cGRhdGVIaWdobGlnaHRJblJhbmdlKGF3YWl0IHRoaXMuZ2V0U3ltYm9scygpLCB0aGlzLmVkaXRvci5nZXRCdWZmZXIoKS5nZXRSYW5nZSgpKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVIaWdobGlnaHRJblJhbmdlKHNiczogU2V0PHN0cmluZz4sIHNlYXJjaFJhbmdlOiBBdG9tLklSYW5nZSkge1xuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMubGF5ZXIuZmluZE1hcmtlcnMoeyBpbnRlcnNlY3RzUmFuZ2U6IHNlYXJjaFJhbmdlIH0pKSB7XG4gICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMuZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlKHJ4LmlkZW50UngsIHNlYXJjaFJhbmdlLCBhc3luYyAoeyBtYXRjaFRleHQsIHJhbmdlIH0pID0+IHtcbiAgICAgIGlmIChzYnMuaGFzKG1hdGNoVGV4dCkpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5kZWNvcmF0ZVJhbmdlKHJhbmdlLCBzZWxlY3RvcnMpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZShyeC5vcGVyYXRvclJ4LCBzZWFyY2hSYW5nZSwgYXN5bmMgKHsgbWF0Y2hUZXh0LCByYW5nZSB9KSA9PiB7XG4gICAgICBpZiAoc2JzLmhhcyhtYXRjaFRleHQpKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGVjb3JhdGVSYW5nZShyYW5nZSwgb3BlcmF0b3JTZWxlY3RvcnMpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2V0U3ltYm9scygpIHtcbiAgICBjb25zdCBzeW1ib2xzID0gYXdhaXQgdGhpcy5jYi5nZXRDb21wbGV0aW9uc0ZvclN5bWJvbCh0aGlzLmVkaXRvci5nZXRCdWZmZXIoKSwgJycsIEF0b20uUG9pbnQuZnJvbU9iamVjdChbMCwgMF0pKVxuICAgIHJldHVybiBuZXcgU2V0KHN5bWJvbHMubWFwKCh7IHFuYW1lIH0pID0+IHFuYW1lKSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZGVjb3JhdGVSYW5nZShyYW5nZTogQXRvbS5SYW5nZSwgbXlzZWxlY3RvcnM6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgW2luU2NvcGVdID0gdGhpcy5lZGl0b3JcbiAgICAgIC5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydCkuZ2V0U2NvcGVzQXJyYXkoKVxuICAgICAgLmZpbHRlcigoc2VsKSA9PiBteXNlbGVjdG9ycy5pbmNsdWRlcyhzZWwpKVxuICAgIGlmIChpblNjb3BlKSB7XG4gICAgICBjb25zdCBzcmFuZ2UgPSB0aGlzLmVkaXRvci5idWZmZXJSYW5nZUZvclNjb3BlQXRQb3NpdGlvbihpblNjb3BlLCByYW5nZS5zdGFydClcbiAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubGF5ZXIubWFya0J1ZmZlclJhbmdlKHNyYW5nZSB8fCByYW5nZSwgeyBpbnZhbGlkYXRlOiAnbmV2ZXInIH0pXG4gICAgICB0aGlzLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHsgdHlwZTogJ3RleHQnLCBjbGFzczoga25vd25JZGVudENsYXNzIH0pXG4gICAgfVxuICB9XG59XG4iXX0=