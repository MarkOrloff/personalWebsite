# share/: private, password-protected pages

`public/share/<slug>/index.html` are unlisted pages for collaborators and family. Each file
holds only a password prompt and ciphertext. The page is decrypted in the reader's browser; nothing
readable is ever committed. The research-results pages are built on hive
(`project9/scripts/misc/collab_share/`). Other self-contained pages can be encrypted locally.

## Create a self-contained page

Prepare a complete HTML page outside this repository, with its private images and scripts embedded.
Do not put unencrypted private assets in `public/`. Then run:

```sh
node share/encrypt.mjs --input /absolute/path/to/page.html --title "private preview"
```

It asks for a password without displaying it, creates a random link under `public/share/`, and prints
the future URL. The generated file contains the unlock screen and encrypted payload; the input file
and password are not copied into the repository. Encryption uses the same PBKDF2 / AES-GCM format
as the research pages. The helper verifies a complete decrypt-and-compare before saving.

To update an existing page, add `--slug <existing-slug> --replace` and use its existing password.
This keeps the salt for remembered access and creates a fresh encryption IV. Without `--replace`,
an existing page is never overwritten. Pages with a `share-copy` JSON block and `data-copy-key`
markers can also use the text editor below.

The `/share/` paths are excluded from the sitemap and carry no-index and no-referrer metadata and
headers. Keep them out of navigation. Anyone with the password and link can open and save the
decrypted content; search exclusion is separate from encryption. Never commit passwords or
unencrypted private HTML, images or generated chart exports.

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
