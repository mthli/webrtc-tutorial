module.exports = {
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `WebRTC 学习指南`,
        short_name: `WebRTC 学习指南`,
        start_url: `/`,
        display: 'minimal-ui',
        icon: 'content/assets/profile.jpg',
      },
    },
    {
      resolve: 'gatsby-theme-apollo-docs',
      options: {
        root: __dirname,
        baseDir: '/',
        contentDir: 'content',

        siteName: 'WebRTC 学习指南',
        pageTitle: 'WebRTC 学习指南',
        description: 'Learning WebRTC the Hard Way 👀',
        githubRepo: 'mthli/webrtc-tutorial',
        twitterHandle: 'mth_li',

        // TODO
        algoliaApiKey: '768e823959d35bbd51e4b2439be13fb7',
        algoliaIndexName: 'apollodata',
        gaTrackingId: 'UA-74643563-13',

        sidebarCategories: {
          null: [
            'index',
            'webrtc-compilation',
          ],
          '基础知识': [
            // TODO
          ],
          '连接流程': [
            // TODO
          ],
          '丢包处理': [
            // TODO
          ],
          '参考资料': [
            '[W3C WebRTC 1.0](https://www.w3.org/TR/webrtc/)',
            '[WebRTC\'s Statistics](https://w3c.github.io/webrtc-stats/)',
            '[discuss-webrtc](https://groups.google.com/g/discuss-webrtc)',
          ],
        },
      },
    },
  ],
};
