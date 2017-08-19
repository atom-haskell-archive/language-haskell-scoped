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
const editor_controller_1 = require("./editor-controller");
let resolveCB;
let cbPromise;
let disposables;
function activate() {
    resolveCB = undefined;
    const bprom = cbPromise = new Promise((resolve) => resolveCB = resolve);
    const bdisp = disposables = new Atom.CompositeDisposable();
    disposables.add(atom.workspace.observeTextEditors((ed) => __awaiter(this, void 0, void 0, function* () {
        if (editor_controller_1.EditorController.shouldActivate(ed)) {
            bdisp.add(new editor_controller_1.EditorController(ed, yield bprom));
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UtaGFza2VsbC1zY29wZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGFuZ3VhZ2UtaGFza2VsbC1zY29wZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1QiwyREFBc0Q7QUFFdEQsSUFBSSxTQUFpRCxDQUFBO0FBQ3JELElBQUksU0FBeUMsQ0FBQTtBQUM3QyxJQUFJLFdBQWlELENBQUE7QUFFckQ7SUFDRSxTQUFTLEdBQUcsU0FBUyxDQUFBO0lBQ3JCLE1BQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUE7SUFDdkUsTUFBTSxLQUFLLEdBQUcsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7SUFDMUQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQU8sRUFBRTtRQUN6RCxFQUFFLENBQUMsQ0FBQyxvQ0FBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxvQ0FBZ0IsQ0FBQyxFQUFFLEVBQUUsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ2xELENBQUM7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBVEQsNEJBU0M7QUFFRDtJQUNFLFNBQVMsR0FBRyxTQUFTLENBQUE7SUFDckIsU0FBUyxHQUFHLFNBQVMsQ0FBQTtJQUNyQixXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3BDLFdBQVcsR0FBRyxTQUFTLENBQUE7QUFDekIsQ0FBQztBQUxELGdDQUtDO0FBRUQseUJBQWdDLE9BQWtCO0lBQ2hELFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakMsQ0FBQztBQUZELDBDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgRWRpdG9yQ29udHJvbGxlciB9IGZyb20gJy4vZWRpdG9yLWNvbnRyb2xsZXInXG5cbmxldCByZXNvbHZlQ0I6ICgodmFsOiBDQlNlcnZpY2UpID0+IHZvaWQpIHwgdW5kZWZpbmVkXG5sZXQgY2JQcm9taXNlOiBQcm9taXNlPENCU2VydmljZT4gfCB1bmRlZmluZWRcbmxldCBkaXNwb3NhYmxlczogQXRvbS5Db21wb3NpdGVEaXNwb3NhYmxlIHwgdW5kZWZpbmVkXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgcmVzb2x2ZUNCID0gdW5kZWZpbmVkXG4gIGNvbnN0IGJwcm9tID0gY2JQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHJlc29sdmVDQiA9IHJlc29sdmUpXG4gIGNvbnN0IGJkaXNwID0gZGlzcG9zYWJsZXMgPSBuZXcgQXRvbS5Db21wb3NpdGVEaXNwb3NhYmxlKClcbiAgZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhhc3luYyAoZWQpID0+IHtcbiAgICBpZiAoRWRpdG9yQ29udHJvbGxlci5zaG91bGRBY3RpdmF0ZShlZCkpIHtcbiAgICAgIGJkaXNwLmFkZChuZXcgRWRpdG9yQ29udHJvbGxlcihlZCwgYXdhaXQgYnByb20pKVxuICAgIH1cbiAgfSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICByZXNvbHZlQ0IgPSB1bmRlZmluZWRcbiAgY2JQcm9taXNlID0gdW5kZWZpbmVkXG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICBkaXNwb3NhYmxlcyA9IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZUNvbXBCYWNrKHNlcnZpY2U6IENCU2VydmljZSkge1xuICByZXNvbHZlQ0IgJiYgcmVzb2x2ZUNCKHNlcnZpY2UpXG59XG4iXX0=