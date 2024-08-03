const proxyUrl = "https://api.allorigins.win/get?url=";
const feedUrl = "https://medium.com/feed/@dhyaan.meditation.app";

async function fetchFeed(feedUrl) {
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(feedUrl));

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const text = data.contents;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");

        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error("Error parsing XML: " + parserError.textContent);
        }

        const items = xmlDoc.getElementsByTagName("item");

        const feedItems = Array.from(items).map(item => {
            const title = item.getElementsByTagName("title")[0]?.textContent || 'No title';
            const link = item.getElementsByTagName("link")[0]?.textContent || 'No link';
            const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || 'No date';

            let description = item.getElementsByTagName("description")[0]?.textContent || '';
            if (!description) {
                const contentEncoded = item.getElementsByTagName("content:encoded")[0]?.textContent || '';
                const descriptionMatch = contentEncoded.match(/<p>(.*?)<\/p>/); // Extract first <p> tag content
                description = descriptionMatch ? descriptionMatch[1] : 'No description';
            }

            if (description.length > 32) {
                description = description.substring(0, 32) + '...';
            }

            const contentEncoded = item.getElementsByTagName("content:encoded")[0]?.textContent || '';
            const imageMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
            const imageUrl = imageMatch ? imageMatch[1] : 'default-image-url';

            return {
                title,
                link,
                description,
                pubDate,
                imageUrl
            };
        });

        return feedItems;

    } catch (error) {
        console.error("Failed to fetch feed:", error);
        return [];
    }
}

fetchFeed(feedUrl).then(feedItems => {
    const blogContainer = document.getElementById("blog-container");
    
    if (feedItems.length === 0) {
        blogContainer.innerHTML = "No blogs have been published yet.";
        return;
    }
    
    const cardHTML = feedItems.map(item => `
        <div class="col-md-4 mb-4 d-flex justify-content-center">
            <div class="card" style="width: 18rem;">
                <img src="${item.imageUrl}" class="card-img-top" alt="Image not available">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text"><small class="text-muted">${item.pubDate}</small></p>
                    <a href="${item.link}" class="btn btn-success" target="_blank" rel="noopener noreferrer">Read more &gt;&gt;</a>
                </div>
            </div>
        </div>
    `).join('');

    blogContainer.innerHTML = cardHTML;
});
