
# YouTube Thumbnail Retriever

![YouTube Thumbnail Retriever Screenshot](./modules/youtube-thumbnail/assets/screenshot-youtube-thumbnail-retriever.png)

If you want to display a list of your recent YouTube Videos in a README file (such as your special profile repo), you can use this solution to easily display thumbnails in a layout that resembles YouTube listings.

### How to use this

1. First, star this repo 😉

2. Follow [Gautam krishna R](https://github.com/gautamkrishnar)'s instructions on his [Blog post workflow](https://github.com/gautamkrishnar/blog-post-workflow) repo so as to create the necessary GitHub Actions which will scan and download your latest YouTube Videos. You can find more detailed information and further options in his repository, but essentially you will need to :
- In your repository, create a folder named .github and create a workflows folder inside it, if it doesn't exist.
- Inside this .github/workflows folder, create a youtube-workflow.yml file, with this content:

```
name: Template Latest Youtube
on:
  schedule:
    # Runs at 08h00 on Sunday: set here your schedulled automation. If you are not familiar with cron, use https://crontab.guru/
    - cron: '0 8 * * 0'
  workflow_dispatch:
jobs:
  update-readme-with-youtube-activity:
    name: Update this repo's README with latest activity from YouTube
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "YOUTUBE" # the tag you will use in your README.md file
          commit_message: "Updated readme with the latest youtube data"
          feed_list: "https://www.youtube.com/feeds/videos.xml?channel_id=your_channel_Id" #replace with your channel Id 
          custom_tags: "channelId/yt:channelId/,videoId/yt:videoId/"
          max_post_count: 6
          template: '$newline[![](https://portfolio.dev.lawyer/api/youtube-thumbnail/?channelId=$channelId&videoId=$videoId)]($url)'
```
- In your README.md file, insert the following where you want your YouTube list to appear:
```
<!-- YOUTUBE:START -->
<!-- YOUTUBE:END -->
```

3. Commit the changes above and run your GitHub Action on GitHub. 





## Support

For support and Bugs, don’t forget to open a new [issue](https://github.com/Dev-Lawyer/youtube-thumbnail-retriever/issues/new).

  
## Thanks to

 - [Gautam krishna R](https://github.com/gautamkrishnar) for his awesome [Blog post workflow](https://github.com/gautamkrishnar/blog-post-workflow) repo
 
  