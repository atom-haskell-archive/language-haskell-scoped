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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UtaGFza2VsbC1zY29wZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGFuZ3VhZ2UtaGFza2VsbC1zY29wZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1QiwyREFBb0Q7QUFFcEQsSUFBSSxTQUFpRCxDQUFBO0FBQ3JELElBQUksU0FBeUMsQ0FBQTtBQUM3QyxJQUFJLFdBQWlELENBQUE7QUFFckQ7SUFDRSxTQUFTLEdBQUcsU0FBUyxDQUFBO0lBQ3JCLE1BQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sS0FBSyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUE7SUFDdkUsTUFBTSxLQUFLLEdBQUcsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7SUFDMUQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQU8sRUFBRTtRQUN6RCxFQUFFLENBQUMsQ0FBQyxvQ0FBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxvQ0FBZ0IsQ0FBQyxFQUFFLEVBQUUsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ2xELENBQUM7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBVEQsNEJBU0M7QUFFRDtJQUNFLFNBQVMsR0FBRyxTQUFTLENBQUE7SUFDckIsU0FBUyxHQUFHLFNBQVMsQ0FBQTtJQUNyQixXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3BDLFdBQVcsR0FBRyxTQUFTLENBQUE7QUFDekIsQ0FBQztBQUxELGdDQUtDO0FBRUQseUJBQWlDLE9BQWtCO0lBQ2pELFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakMsQ0FBQztBQUZELDBDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtFZGl0b3JDb250cm9sbGVyfSBmcm9tICcuL2VkaXRvci1jb250cm9sbGVyJ1xuXG5sZXQgcmVzb2x2ZUNCOiAoKHZhbDogQ0JTZXJ2aWNlKSA9PiB2b2lkKSB8IHVuZGVmaW5lZFxubGV0IGNiUHJvbWlzZTogUHJvbWlzZTxDQlNlcnZpY2U+IHwgdW5kZWZpbmVkXG5sZXQgZGlzcG9zYWJsZXM6IEF0b20uQ29tcG9zaXRlRGlzcG9zYWJsZSB8IHVuZGVmaW5lZFxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKCkge1xuICByZXNvbHZlQ0IgPSB1bmRlZmluZWRcbiAgY29uc3QgYnByb20gPSBjYlByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gcmVzb2x2ZUNCID0gcmVzb2x2ZSlcbiAgY29uc3QgYmRpc3AgPSBkaXNwb3NhYmxlcyA9IG5ldyBBdG9tLkNvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBkaXNwb3NhYmxlcy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGFzeW5jIChlZCkgPT4ge1xuICAgIGlmIChFZGl0b3JDb250cm9sbGVyLnNob3VsZEFjdGl2YXRlKGVkKSkge1xuICAgICAgYmRpc3AuYWRkKG5ldyBFZGl0b3JDb250cm9sbGVyKGVkLCBhd2FpdCBicHJvbSkpXG4gICAgfVxuICB9KSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUgKCkge1xuICByZXNvbHZlQ0IgPSB1bmRlZmluZWRcbiAgY2JQcm9taXNlID0gdW5kZWZpbmVkXG4gIGRpc3Bvc2FibGVzICYmIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICBkaXNwb3NhYmxlcyA9IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3VtZUNvbXBCYWNrIChzZXJ2aWNlOiBDQlNlcnZpY2UpIHtcbiAgcmVzb2x2ZUNCICYmIHJlc29sdmVDQihzZXJ2aWNlKVxufVxuIl19