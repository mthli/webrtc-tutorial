module.exports = {
  pathPrefix: '/docs',
  plugins: [
    {
      resolve: 'gatsby-theme-apollo-docs',
      options: {
        root: __dirname,
        baseDir: 'docs',
        contentDir: 'source',

        siteName: 'WebRTC 学习指南',
        pageTitle: 'WebRTC 学习指南',
        description: 'Learning WebRTC the Hard Way 👀',
        githubRepo: 'mthli/webrtc-tutorial',

        sidebarCategories: {
          null: [
            'index',
            'webrtc-compilation',
          ],
          Tutorial: [
            // TODO
          ],
          '参考资料': [
            // TODO
          ],
        },
      },
    },
  ],
};
