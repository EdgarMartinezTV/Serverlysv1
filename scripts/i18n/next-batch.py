"""Print the next batch of untranslated strings (by file).  python3 scripts/i18n/next-batch.py [maxwords]"""
import json, sys, glob
todo = json.load(open("scripts/i18n/todo-final.json"))
done = {}
for f in glob.glob("scripts/i18n/es/*.json"): done.update(json.load(open(f)))
limit = int(sys.argv[1]) if len(sys.argv) > 1 else 1800
out, words, left = {}, 0, 0
for f, arr in todo.items():
    for s in arr:
        if s in done or s in out: continue
        left += 1
        if words < limit: out[s] = f; words += len(s.split())
cur = None
for s, f in out.items():
    if f != cur: print(f"## {f}"); cur = f
    print(json.dumps(s, ensure_ascii=False))
print(f"\n# batch: {len(out)} strings, {words} words | remaining after: {left - len(out)} | done so far: {len(done)}", file=sys.stderr)
