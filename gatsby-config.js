module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    siteUrl: 'https://webrtc.mthli.com',
  },
  plugins: [
    'gatsby-plugin-sitemap',
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
      resolve: '@mthli/gatsby-theme-apollo-docs',
      options: {
        root: __dirname,
        baseDir: '/',
        contentDir: 'content',

        siteName: 'WebRTC 学习指南',
        pageTitle: 'WebRTC 学习指南',
        baseUrl: 'https://webrtc.mthli.com',
        description: 'Learning WebRTC the Hard Way 👀',
        githubRepo: 'mthli/webrtc-tutorial',
        twitterHandle: 'mth_li',
        gaTrackingId: 'UA-70441776-3',

        gatsbyRemarkPlugins: [
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-footnotes',
            options: {
              footnoteBackRefPreviousElementDisplay: 'inline',
              footnoteBackRefDisplay: 'inline',
              footnoteBackRefAnchorStyle: 'text-decoration: none;',
            },
          },
        ],

        sidebarCategories: {
          null: [
            'index',
            'basic/webrtc-compilation/index',
            'basic/webrtc-breakpoint/index',
          ],
          '基础知识': [
            'basic/p2p-hole-punching/index',
            'basic/ice-stun-turn/index',
            'basic/sdp-introduction/index',
            'basic/mesh-mcu-sfu/index',
            'basic/rtp-introduction/index',
            // TODO
          ],
          '连接流程': [
            'connection/peer-connection/index',
            'connection/ice-connection-sorting/index',
            // TODO
          ],
          '媒体流程': [
            'media/video-outbound/index',
            // TODO
          ],
          '弱网优化': [
            'lost/video-frame-words/index',
            'lost/video-quality-limitation/index',
            // TODO
          ],
          '编程模型': [
            'code/criticalsection/index', // FIXME critical-section
            'code/sigslot/index',
            'code/smart-pointers/index',
            // TODO
          ],
          '常见问题': [
            '[获取视频旋转角度](https://webrtc.mthli.com/basic/rtp-introduction/#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC%E8%A7%92%E5%BA%A6)',
            '[添加滤镜](https://webrtc.mthli.com/media/video-outbound/#%E6%B7%BB%E5%8A%A0%E6%BB%A4%E9%95%9C)',
            '[编码前丢帧](https://webrtc.mthli.com/lost/video-quality-limitation/#%E7%BC%96%E7%A0%81%E5%89%8D%E4%B8%A2%E5%B8%A7)',
            'common/frame-transformer/index',
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
