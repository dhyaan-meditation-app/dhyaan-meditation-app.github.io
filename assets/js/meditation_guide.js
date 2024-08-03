function copyLinkToClipboard() {
    const textToCopy = 'https://dhyaan-meditation-app.github.io/meditation_guide.html';

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Link successfully copied to the clipboard!")
    }).catch(err => {
        console.error("There was an error in copying the link to the clipboard, please manually try copying the link!");
    });
}