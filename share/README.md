# share/: private, password-protected pages

`public/share/<slug>/index.html` are unlisted pages for collaborators (fMRI maps and figures). Each file
holds only a password prompt and ciphertext. The page is decrypted in the reader's browser; nothing
readable is ever committed. The pages are built on hive (`project9/scripts/misc/collab_share/`); this
folder only lets you change their words.

## Change the text (on the Mac, in this repo)

```sh
git checkout main && git pull          # edit on main: the share page is published from main
node share/edit.mjs                    # or: node share/edit.mjs <slug>, if there are several pages
```

It asks for the page's password, then prints `http://127.0.0.1:4322/`. Open it and click **edit text**
at the bottom left. Click any of the page's own words (title, intro, notice, map titles and captions,
the figure's caption and footnote, contact line, footer) and type. **Enter** or clicking away saves;
**Escape** cancels. Each save rewrites `public/share/<slug>/index.html`, still encrypted, with the same
password. Readers who ticked "remember on this device" keep access. `ctrl-c` stops the editor.

Not editable here: words drawn inside the figure image, the maps, and the viewer's own buttons. Ask
Claude for those (rebuild on hive).

Needs Node 18 or newer (`node --version`), which you already have for `npm run dev`. No packages.
The decrypted page exists only in the editor's memory; nothing readable is written to disk.

## Publish

```sh
git add public/share/<slug>/index.html
git commit -m "Update shared page text"
git push                               # main; Netlify deploys it
```

Commit on **main**. The local `work/website-redesign` branch has no upstream, so a commit there is
never published. When Claude later rebuilds the page on hive (new maps, figures), it first copies
your edited text back (`make_share_page.py --text-from`). Your wording is kept as long as the
edited file was pushed or is in the clone it reads.
