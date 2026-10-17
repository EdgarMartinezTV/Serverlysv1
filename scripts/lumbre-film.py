# Rebuild the Lumbre demo films from Coverr source clips (see public/restaurant/CREDITS.md).
# Download each clip to <footage_dir> as cv_<slug>.mp4, then:
#   python3 scripts/lumbre-film.py <footage_dir> public/restaurant/video
# Needs ffmpeg with libx264 and libsvtav1.
"""Cut, grade and encode the Lumbre demo films from Coverr source clips.

usage: python3 edit.py <footage_dir> <out_dir>
"""
import subprocess, sys, os

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
XF = 0.8  # crossfade seconds

# (file, start, source_seconds, speed (playback slower when >1), mobile focus x 0..1)
HERO = [
    ("cv_a-lit-fire-2170.mp4", 0.0, 2.2, 2.0, 0.55),
    ("cv_chef-adding-parsley-to-a-dish-in-a-restaurant-2340.mp4", 2.0, 4.2, 1.0, 0.55),
    ("cv_grilled-steak-8580.mp4", 1.5, 3.6, 1.25, 0.42),
    ("cv_pouring-wine-into-glasses-5331.mp4", 3.6, 2.2, 2.0, 0.55),
    ("cv_pouring-wine-421.mp4", 2.0, 4.2, 1.0, 0.46),
    ("cv_steak-and-red-wine-4022.mp4", 0.5, 3.4, 1.25, 0.45),
    # Loop seam: the fire's opening again, so the last crossfade lands on frame one.
    ("cv_a-lit-fire-2170.mp4", 0.0, XF / 2.0, 2.0, 0.55),
]
IMMERSIVE = [
    ("cv_smoke-coming-from-grilled-chicken-1035.mp4", 1.0, 6.0, 1.0, 0.5),
    ("cv_cutting-steak-1062.mp4", 4.0, 4.6, 1.25, 0.5),
    ("cv_smoke-coming-from-grilled-chicken-1035.mp4", 1.0, XF, 1.0, 0.5),
]

# Warm, low-key film grade: pull exposure down, warm the shadows, keep skin
# and food saturated but not loud, soft vignette for the type to sit on.
GRADE = (
    "eq=contrast=1.06:brightness=-0.035:saturation=0.9:gamma=0.96,"
    "colorbalance=rs=0.05:gs=0.01:bs=-0.05:rm=0.03:bm=-0.03:rh=0.02:bh=-0.02,"
    "vignette=angle=PI/4.5"
)


def build(clips, w, h, portrait):
    inputs, chains = [], []
    durs = []
    for i, (f, start, length, speed, focus) in enumerate(clips):
        inputs += ["-ss", str(start), "-t", str(length + 0.2), "-i", os.path.join(SRC, f)]
        d = length * speed
        durs.append(d)
        if portrait:
            # Scale to the target height, then crop a 9:16 window around the subject.
            geo = f"scale=-2:{h},crop={w}:{h}:'max(0,min(iw-{w},iw*{focus}-{w}/2))':0"
        else:
            geo = f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}"
        chains.append(
            f"[{i}:v]setpts={speed}*(PTS-STARTPTS),fps=24,{geo},setsar=1,format=yuv420p,"
            f"trim=duration={d:.3f},setpts=PTS-STARTPTS[c{i}]"
        )
    prev, t = "c0", durs[0]
    for i in range(1, len(clips)):
        off = t - XF
        chains.append(f"[{prev}][c{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}]")
        prev, t = f"x{i}", off + durs[i]
    # The seam clip is exactly one crossfade long, so the film ends as the
    # fade into the opening shot completes and the loop restarts on it.
    total = t
    chains.append(f"[{prev}]{GRADE},trim=duration={total:.3f}[out]")
    return inputs, ";".join(chains), total


def encode(name, clips, w, h, portrait, crf_h264, crf_av1):
    inputs, graph, total = build(clips, w, h, portrait)
    base = os.path.join(OUT, name)
    common = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", graph, "-map", "[out]", "-an"]
    subprocess.run([*common, "-c:v", "libx264", "-preset", "slow", "-crf", str(crf_h264), "-profile:v", "high",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-g", "48", f"{base}.mp4"], check=True)
    subprocess.run([*common, "-c:v", "libsvtav1", "-preset", "6", "-crf", str(crf_av1), "-pix_fmt", "yuv420p",
                    "-g", "48", f"{base}.webm"], check=True)
    # Poster = the film's first frame, so the swap from poster to video is invisible.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{base}.mp4", "-frames:v", "1", "-q:v", "3", f"{base}-poster.jpg"], check=True)
    print(f"{name}: {total:.2f}s", {e: os.path.getsize(f"{base}{e}") // 1024 for e in (".mp4", ".webm", "-poster.jpg")}, "KB")


encode("lumbre-hero", HERO, 1920, 1080, False, 27, 40)
encode("lumbre-hero-mobile", HERO, 720, 1280, True, 28, 42)
encode("lumbre-fire", IMMERSIVE, 1920, 1080, False, 28, 42)
encode("lumbre-fire-mobile", IMMERSIVE, 720, 1280, True, 29, 43)
