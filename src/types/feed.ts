/**
 * @fileoverview Defines the TypeScript interface for an RSS feed item.
 */

// The shape of the 'enclosure' object which contains the image URL.
export interface FeedItemEnclosure {
    url: string;
    type: string; // e.g., 'image/jpeg'
}

// The main interface for a single item in the RSS feed.
export interface FeedItem {
  title: string;
  link: string;
  pubDate: string; // This is an ISO date string
  isoDate: string; // Often, rss-parser provides both
  content: string;
  contentSnippet: string;
  enclosure?: FeedItemEnclosure; // The enclosure with the image is optional
  // Add any other properties that your rss-parser provides
}
