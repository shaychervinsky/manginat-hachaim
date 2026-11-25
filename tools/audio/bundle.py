"""Bundle per-item MP3s into a few files per voice, with silence between clips, and write the offsets.
Usage: python3 bundle.py <keys file> <in dir out_el> <out dir docs/audio> <manifest.json>"""
import sys, os, subprocess, json, struct, wave, tempfile
keys_file, src, dst, man = sys.argv[1:5]
keys = open(keys_file).read().split() + ["sample"]
SR, GAP, PER = 44100, 0.9, 25
manifest = {}
for v in ["Nimrod", "Dalit"]:
    os.makedirs(f"{dst}/{v}", exist_ok=True)
    for f in os.listdir(f"{dst}/{v}"): os.remove(f"{dst}/{v}/{f}")
    vk = sorted(keys); manifest[v] = {}
    for b in range(0, len(vk), PER):
        chunk, pcm, pos, idx = vk[b:b+PER], bytearray(), 0, b // PER
        gap = b"\x00\x00" * int(SR * GAP)
        pcm += gap; pos += len(gap)
        for k in chunk:
            raw = subprocess.run(["ffmpeg","-v","error","-i",f"{src}/{v}/{k}.mp3","-f","s16le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
            manifest[v][k] = [idx, round(pos/2/SR,3), round(len(raw)/2/SR,3)]
            pcm += raw + gap; pos += len(raw) + len(gap)
        out = f"{dst}/{v}/b{idx:02d}.mp3"
        subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ar",str(SR),"-ac","1","-i","-","-c:a","libmp3lame","-b:a","64k","-write_xing","1",out],input=bytes(pcm),check=True)
json.dump(manifest, open(man,"w"), separators=(",",":"))
print({v: len(manifest[v]) for v in manifest}, sum(len(os.listdir(f"{dst}/{v}")) for v in manifest), "files")
