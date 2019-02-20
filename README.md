# Keep or Mull MTG Bot

### Goal

This twitter bots purpose is to fetch random "Magic: the Gathering" deck data from Standard, Modern, Legacy and Vintage and post 7 card opening hand images with a deck name, play/draw info, a link to the deck list and the hashtag #KeepOrMull. The idea is to spur conversation on the merits of keeping or mulliganing certain hands.

### Data Fetching

All data comes from two sources: MTG Top 8 and Scryfall

Event and deck data are mined from MTG Top 8, from paper and online events respectively. This is used to build image urls which are then requested from Scryfall. Images are then downloaded and merged via the "merge-img" library. After merging is complete the image is prepared and sent out via tweet through Twitters API.

MTG Top 8 provides the deck data for format, deck name, card names and deck list and scryfall provides access to card images.

### Special Thanks to freeall, preco21 and MTG Top 8

Base data fetching from MTG Top 8 courtesy of freeall and his work on data scrapping from MTG Top 8. His library can be found here: https://github.com/freeall/mtgtop8

preco21 merge-img library can be found here:
https://github.com/preco21/merge-img

Thanks to MTG Top 8 for use of there data.

### Disclaimer

This bot is NOT affiliated with "Wizards of the Coast" and NOT affiliated with "MTG Top 8".
