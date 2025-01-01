const lunr = require('lunr');
const subscriptions = require('./subscriptions.json');

// Prepare the index
const idx = lunr(function () {
    this.field('title');
    this.field('description');

    subscriptions.forEach((sub, index) => {
        this.add({
            id: index,
            title: sub.snippet.title,
            description: sub.snippet.description,
        });
    });
});

// Search query
const searchQuery = 'business';
const results = idx.search(searchQuery);

// Map results to channel titles
const matchedChannels = results.map(result => subscriptions[result.ref].snippet.title);
console.log("Search Results:", matchedChannels);
